import { useState } from "react";
import { Modal, Button, Group, Stack } from "@mantine/core";
import { FiCheck, FiX } from "react-icons/fi";

export default function SuccessModal({ isOpen, onClose }) {
    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
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
                    onClick={onClose}
                    fullWidth
                    rightIcon={<FiX size={20} />}
                >
                    Đóng
                </Button>
            </Stack>
        </Modal>
    );
}
