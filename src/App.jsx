// filepath: c:\Users\Deno\hvm\thanhdoan.pnt\src\App.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Stack,
  Grid,
  LoadingOverlay,
  Title,
  Divider,
  SegmentedControl,
  Slider,
  Text,
  Tooltip,
  Group,
  NumberInput
} from "@mantine/core";
import FRAME from "./assets/frame.png";
import AVATAR_FRAME from "./assets/avatar.png";
import "./App.css";
import "./fonts.css";

// Import components
import ImageUploader from "./components/ImageUploader";
import FormInputs from "./components/FormInputs";
import CanvasPreview from "./components/CanvasPreview";
import ImageFrameRenderer from "./components/ImageFrameRenderer";
import ImageDownloader from "./components/ImageDownloader";

export default function ImageFrameOverlay() {  // State management
  const [frame, setFrame] = useState(null);
  const [avatarFrame, setAvatarFrame] = useState(null);
  const [uploadedImg, setUploadedImg] = useState(null);
  const [uploadedImgLoaded, setUploadedImgLoaded] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [avatarFrameLoaded, setAvatarFrameLoaded] = useState(false); const [formData, setFormData] = useState({
    name: "",
  });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [avatarCanvasSize, setAvatarCanvasSize] = useState({ width: 0, height: 0 });
  const [renderer, setRenderer] = useState(null);
  const [activeFrame, setActiveFrame] = useState("circle"); // Default to circular frame

  // Image customization settings
  const [circularImageSettings, setCircularImageSettings] = useState({
    x: 610,
    y: 868,
    size: 2655
  });

  const [squareImageSettings, setSquareImageSettings] = useState({
    x: 375,
    y: 375,
    size: 3000
  });

  // Load frame images
  useEffect(() => {
    // Load circular frame
    const frameImg = new Image();
    frameImg.src = FRAME;
    frameImg.onload = () => {
      setFrame(frameImg);
      setFrameLoaded(true);

      // Load avatar frame
      const avatarImg = new Image();
      avatarImg.src = AVATAR_FRAME;
      avatarImg.onload = () => {
        setAvatarFrame(avatarImg);
        setAvatarFrameLoaded(true);
        setRenderer(new ImageFrameRenderer(frameImg, avatarImg));
      };
    };
  }, []);
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Get the container width for the canvas (full width for desktop, less for mobile)
      const containerWidth = window.innerWidth >= 768
        ? window.innerWidth * 0.6
        : window.innerWidth * 0.85;

      // Scale the circular frame
      if (frame) {
        const scale = containerWidth / frame.width;
        setCanvasSize({
          width: frame.width * scale,
          height: frame.height * scale,
        });
      }

      // Scale the avatar frame
      if (avatarFrame) {
        const scale = containerWidth / avatarFrame.width;
        setAvatarCanvasSize({
          width: avatarFrame.width * scale,
          height: avatarFrame.height * scale,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [frame, avatarFrame]);

  // Handle image loading from ImageUploader component
  const handleImageLoaded = useCallback((image) => {
    setUploadedImg(image);
    setUploadedImgLoaded(true);
  }, []);
  // Draw frame on canvas
  const drawCircularFrame = useCallback((canvas) => {
    if (renderer && frameLoaded) {
      renderer.drawFrameOnCanvas(
        canvas,
        uploadedImg,
        uploadedImgLoaded,
        formData,
        canvasSize,
        circularImageSettings
      );
    }
  }, [renderer, frameLoaded, uploadedImg, uploadedImgLoaded, formData, canvasSize, circularImageSettings]);

  // Draw avatar frame on canvas
  const drawAvatarFrame = useCallback((canvas) => {
    if (renderer && avatarFrameLoaded) {
      renderer.drawAvatarFrameOnCanvas(
        canvas,
        uploadedImg,
        uploadedImgLoaded,
        avatarCanvasSize,
        squareImageSettings
      );
    }
  }, [renderer, avatarFrameLoaded, uploadedImg, uploadedImgLoaded, avatarCanvasSize, squareImageSettings]);  // Handle circular frame download
  const handleCircularDownload = async () => {
    if (!uploadedImgLoaded) {
      alert("Vui lòng tải ảnh lên trước khi lưu!");
      return false;
    }

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên đồng chí!");
      return false;
    }

    try {
      if (renderer) {
        const blob = await renderer.createHighResolutionImage(
          uploadedImg,
          uploadedImgLoaded,
          formData,
          circularImageSettings
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${formData.name || "frame_image"}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error downloading image:", error);
      return false;
    }
  };
  // Handle avatar frame download
  const handleAvatarDownload = async () => {
    if (!uploadedImgLoaded) {
      alert("Vui lòng tải ảnh lên trước khi lưu!");
      return false;
    }

    try {
      if (renderer) {
        const blob = await renderer.createHighResolutionAvatarImage(
          uploadedImg,
          uploadedImgLoaded,
          squareImageSettings
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${formData.name || "avatar_image"}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error downloading avatar image:", error);
      return false;
    }
  };  // Helper function to get the reason why the button is disabled
  const getDownloadDisabledReason = () => {
    if (!uploadedImgLoaded) {
      return "Vui lòng tải ảnh lên trước khi lưu";
    }

    if (activeFrame === "circle" && !formData.name.trim()) {
      return "Vui lòng nhập tên đồng chí";
    }

    return null;
  };
  return (
    <div className="pink-theme-background" style={{
      background: 'linear-gradient(135deg, #FFF0F6 0%, #FFF5F9 100%)',
      padding: '2rem 0',
      minHeight: '100vh'
    }}>
      <Container size="xl" py="xl" className="pink-theme-container">
        <Grid gutter="md">
          <Grid.Col sm={12} md={4}>
            <Stack spacing="lg">
              <ImageUploader onImageLoaded={handleImageLoaded} />
              <FormInputs formData={formData} setFormData={setFormData} /><SegmentedControl
                value={activeFrame}
                onChange={setActiveFrame}
                data={[
                  { label: 'Khung ngang', value: 'circle' },
                  { label: 'Avatar', value: 'square' },
                ]}
                fullWidth
                size="md"
                mb="md"
              />


              <Tooltip
                label={getDownloadDisabledReason()}
                disabled={!getDownloadDisabledReason()}
                position="bottom"
                withArrow
              >
                <div style={{ width: '100%' }}>
                  {activeFrame === "circle" ? (
                    <ImageDownloader
                      onDownload={handleCircularDownload}
                      disabled={!uploadedImgLoaded || formData.name.trim() === ""}
                      buttonLabel="Tải Khung ngang"
                    />
                  ) : (
                    <ImageDownloader
                      onDownload={handleAvatarDownload}
                      disabled={!uploadedImgLoaded}
                      buttonLabel="Tải avatar"
                    />
                  )}
                </div>
              </Tooltip>
            </Stack>
          </Grid.Col>
          <Grid.Col sm={12} md={8}>
            <div>
              {activeFrame === "circle" ? (
                <CanvasPreview
                  drawFrame={drawCircularFrame}
                  frame={frame}
                  uploadedImg={uploadedImg}
                  uploadedImgLoaded={uploadedImgLoaded}
                  frameLoaded={frameLoaded}
                  formData={formData}
                  canvasSize={canvasSize}
                  title="Khung ngang"
                />
              ) : (
                <CanvasPreview
                  drawFrame={drawAvatarFrame}
                  frame={avatarFrame}
                  uploadedImg={uploadedImg}
                  uploadedImgLoaded={uploadedImgLoaded}
                  frameLoaded={avatarFrameLoaded}
                  formData={formData}
                  canvasSize={avatarCanvasSize}
                  title="Ảnh Avatar"
                />
              )}
            </div>
          </Grid.Col>
        </Grid>

        {/* Loading overlay removed as requested */}
      </Container>
    </div>
  );
}
