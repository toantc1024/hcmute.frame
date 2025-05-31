import { useState } from "react";
import { Button } from "@mantine/core";
import { FiDownload } from "react-icons/fi";
import SuccessModal from "./SuccessModal";

export default function ImageDownloader({
    onDownload,
    disabled,
    buttonLabel = "Tải Ảnh Xuống",
}) {
    const [saving, setSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleDownload = async () => {
        try {
            setSaving(true);
            const success = await onDownload();
            if (success) {
                setShowSuccessModal(true);
            }
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
        <>            <Button
                size="lg"
                radius="xl"
                onClick={handleDownload}
                fullWidth
                color="pink"
                loading={saving}
                leftIcon={<FiDownload size={20} />}
                disabled={disabled}
            >
                {saving ? "Đang xử lý..." : buttonLabel}
            </Button>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />
        </>
    );
}
