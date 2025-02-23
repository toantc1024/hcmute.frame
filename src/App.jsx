import { useState, useRef, useEffect } from "react";
import {
  Container,
  Stack,
  TextInput,
  Button,
  Modal,
  Paper,
  Slider,
  Grid,
  LoadingOverlay,
  Group,
} from "@mantine/core";
import { FiUpload, FiDownload, FiCheck, FiX, FiImage } from "react-icons/fi";
import Cropper from "react-easy-crop";
import FRAME from "./assets/frame.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "./fonts.css"; // Add this import

export default function ImageFrameOverlay() {
  const canvasRef = useRef(null);
  const [frame, setFrame] = useState(null);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [uploadedImgLoaded, setUploadedImgLoaded] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    unit: "", // Added new field for ĐƠN VỊ
  });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Crop related states
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [tempImage, setTempImage] = useState(null);

  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const frameImg = new Image();
    frameImg.src = FRAME;
    frameImg.onload = () => {
      setFrame(frameImg);
      setFrameLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (frameLoaded) {
      drawFrameWithImage();
    }
  }, [frameLoaded, uploadedImgLoaded, formData, canvasSize]);

  useEffect(() => {
    const handleResize = () => {
      if (frame) {
        const containerWidth = window.innerWidth * 0.8; // 80% of viewport width
        const scale = containerWidth / frame.width;
        setCanvasSize({
          width: frame.width * scale,
          height: frame.height * scale,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [frame]);

  const handleImageUpload = (file) => {
    if (!file) return;

    // Reset states for new upload
    setUploadedImg(null);
    setUploadedImgLoaded(false);
    setCroppedAreaPixels(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });

    const reader = new FileReader();
    reader.onload = (e) => {
      setTempImage(e.target.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);

    // Clear the file input value to allow selecting the same file again
    fileInputRef.current.value = "";
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImage = async () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = await createImage(tempImage);

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const croppedImage = new Image();
      croppedImage.src = canvas.toDataURL();
      croppedImage.onload = () => {
        setUploadedImg(croppedImage);
        setUploadedImgLoaded(true);
        setShowCropModal(false);
      };
    } catch (error) {
      console.error(error);
    }
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", reject);
      image.src = url;
    });

  const drawCircularImage = (ctx, image, x, y, targetSize = 300) => {
    // Calculate scaling to fit the target size while maintaining aspect ratio
    const scale = targetSize / Math.max(image.width, image.height);
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;

    // Center the image within the circle
    const offsetX = (targetSize - scaledWidth) / 2;
    const offsetY = (targetSize - scaledHeight) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(
      x + targetSize / 2,
      y + targetSize / 2,
      targetSize / 2,
      0,
      Math.PI * 2
    );
    ctx.closePath();
    ctx.clip();

    // Draw the image scaled and centered
    ctx.drawImage(image, x + offsetX, y + offsetY, scaledWidth, scaledHeight);
    ctx.restore();
  };

  const drawText = (
    ctx,
    text,
    x,
    y,
    fillColor,
    centered = false,
    forcedScale = null
  ) => {
    const scale = forcedScale || canvasSize.width / frame.width;
    ctx.save();

    // Setup shadow and basic styles
    ctx.shadowOffsetX = 2 * scale;
    ctx.shadowOffsetY = 1 * scale;
    ctx.shadowBlur = 8 * scale;
    ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
    ctx.font = `bold ${Math.round(65 * scale)}px UTM-Swis`;
    ctx.lineWidth = Math.round(8 * scale);
    ctx.strokeStyle = "white";
    ctx.fillStyle = fillColor;

    ctx.textAlign = centered ? "center" : "left";
    ctx.textBaseline = "middle";

    const xPos = forcedScale ? x : x * scale;
    const yPos = forcedScale ? y : y * scale;

    ctx.strokeText(text, xPos, yPos);
    ctx.fillText(text, xPos, yPos);

    ctx.restore();
  };

  const drawFrameWithImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    if (!frameLoaded || !canvas || !ctx) return;

    // Normal preview size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const scale = canvasSize.width / frame.width;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circular image
    if (uploadedImgLoaded) {
      const imageX = 332 * scale;
      const imageY = 570 * scale;
      const imageSize = 652 * scale;
      drawCircularImage(ctx, uploadedImg, imageX, imageY, imageSize);
    }

    // Draw frame
    ctx.save();
    ctx.scale(scale, scale);
    ctx.drawImage(frame, 0, 0);
    ctx.restore();

    // Draw position and unit in orange
    drawText(ctx, formData.position, 667, 1450, "#0071bb", true);
    drawText(ctx, formData.unit, 667, 1550, "#0071bb", true);

    // Draw name text with prefix
    if (formData.name) {
      // Calculate text measurements
      ctx.save();
      ctx.font = `bold ${Math.round(65 * scale)}px UTM-Swis`;
      const prefix = "Đồng chí: ";
      const totalWidth = ctx.measureText(prefix + formData.name).width;
      const startX = 667 * scale - totalWidth / 2;
      const prefixWidth = ctx.measureText(prefix).width;
      ctx.restore();

      // Draw texts
      drawText(ctx, prefix, startX / scale, 1350, "#0071bb", false);
      drawText(
        ctx,
        formData.name,
        (startX + prefixWidth) / scale,
        1350,
        "#f2774b",
        false
      );
    }
  };

  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const saveImage = async () => {
    try {
      if (!uploadedImgLoaded) {
        alert("Vui lòng tải ảnh lên trước khi lưu!");
        return;
      }

      if (!formData.name.trim()) {
        alert("Vui lòng nhập tên đồng chí!");
        return;
      }

      setSaving(true);

      const canvas = canvasRef.current;
      const exportCanvas = document.createElement("canvas");
      const exportCtx = exportCanvas.getContext("2d", { alpha: true });

      if (!exportCtx) {
        throw new Error("Không thể tạo context cho canvas");
      }

      exportCanvas.width = frame.width;
      exportCanvas.height = frame.height;

      // Draw the circular image at high resolution
      if (uploadedImgLoaded) {
        const imageX = 332;
        const imageY = 570;
        const imageSize = 652;
        drawCircularImage(exportCtx, uploadedImg, imageX, imageY, imageSize);
      }

      // Draw frame and position/unit text
      exportCtx.drawImage(frame, 0, 0);
      exportCtx.imageSmoothingEnabled = true;
      exportCtx.imageSmoothingQuality = "high";

      // Draw position and unit in orange
      drawText(exportCtx, formData.position, 667, 1450, "#f2774b", true, 1);
      drawText(exportCtx, formData.unit, 667, 1550, "#f2774b", true, 1);

      // Calculate and draw centered text group for export
      const prefix = "Đồng chí: ";
      exportCtx.font = "bold 65px UTM-Swis";
      const totalWidth = exportCtx.measureText(prefix + formData.name).width;
      const startX = 667 - totalWidth / 2;
      const prefixWidth = exportCtx.measureText(prefix).width;

      // Draw prefix and name with different colors
      drawText(exportCtx, prefix, startX, 1350, "#0071bb", false, 1);
      drawText(
        exportCtx,
        formData.name,
        startX + prefixWidth,
        1350,
        "#f2774b",
        false,
        1
      );

      // Convert to Blob and create URL
      await new Promise((resolve, reject) => {
        exportCanvas.toBlob(
          (blob) => {
            if (blob) {
              try {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = `${formData.name || "frame_image"}.png`;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => {
                  URL.revokeObjectURL(url);
                  setShowSuccessModal(true);
                }, 100);
                resolve();
              } catch (error) {
                reject(error);
              }
            } else {
              reject(new Error("Không thể tạo file ảnh"));
            }
          },
          "image/png",
          1.0
        );
      });
    } catch (error) {
      console.error("Lỗi khi lưu ảnh:", error);
      alert(
        `Có lỗi xảy ra khi lưu ảnh: ${error.message || "Lỗi không xác định"}`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Grid gutter="md">
        <Grid.Col sm={12} md={4}>
          <Stack spacing="lg">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleImageUpload(e.target.files[0])}
              style={{ display: "none" }}
              accept="image/*"
            />
            <Button
              size="lg"
              radius="xl"
              onClick={triggerFileInput}
              fullWidth
              leftIcon={<FiImage size={20} />}
            >
              Tải ảnh lên
            </Button>
            <TextInput
              size="lg"
              radius="xl"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nhập Tên Đồng Chí"
              label="TÊN ĐỒNG CHÍ"
              styles={{ label: { fontSize: "1rem", fontWeight: 500 } }}
            />
            <TextInput
              size="lg"
              radius="xl"
              value={formData.position}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, position: e.target.value }))
              }
              placeholder="Nhập Chức Vụ"
              label="CHỨC VỤ"
              styles={{ label: { fontSize: "1rem", fontWeight: 500 } }}
            />
            <TextInput
              size="lg"
              radius="xl"
              value={formData.unit}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, unit: e.target.value }))
              }
              placeholder="Nhập Đơn Vị"
              label="ĐƠN VỊ"
              styles={{ label: { fontSize: "1rem", fontWeight: 500 } }}
            />
            <Button
              size="lg"
              radius="xl"
              onClick={saveImage}
              fullWidth
              color="blue"
              loading={saving}
              leftIcon={<FiDownload size={20} />}
            >
              {saving ? "Đang xử lý..." : "Tải Ảnh Xuống"}
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col sm={12} md={8}>
          <Paper p="md" style={{ width: "100%", overflow: "hidden" }}>
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: "100%",
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />
          </Paper>
        </Grid.Col>
      </Grid>

      <LoadingOverlay visible={saving} overlayBlur={2} />

      <Modal
        opened={showCropModal}
        onClose={() => setShowCropModal(false)}
        title="Cắt ảnh"
        size="xl"
      >
        <div style={{ position: "relative", height: 400, marginBottom: 20 }}>
          <Cropper
            image={tempImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="round"
          />
        </div>
        <Slider
          value={zoom}
          onChange={setZoom}
          min={1}
          max={3}
          step={0.1}
          label="Thu phóng"
          mb="md"
          size="lg"
        />
        <Button onClick={getCroppedImage} fullWidth size="lg" radius="xl">
          Xác nhận
        </Button>
      </Modal>

      <Modal
        opened={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={
          <Group>
            <FiCheck size={20} color="green" />
            Thành công
          </Group>
        }
        size="sm"
      >
        <Stack spacing="md">
          <div>Ảnh đã được tải xuống thành công!</div>
          <Button
            onClick={() => setShowSuccessModal(false)}
            fullWidth
            rightIcon={<FiX size={20} />}
          >
            Đóng
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}
