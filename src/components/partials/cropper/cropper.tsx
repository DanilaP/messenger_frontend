import { Modal } from "antd";
import { useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./cropper.scss";

interface AvatarCropperModalProps {
    open: boolean;
    file: File | null;
    onClose: () => void;
    onSave: (croppedFile: File) => void;
    aspect?: number;
}

const Cropper = ({
	open,
	file,
	onClose,
	onSave,
	aspect = 1,
}: AvatarCropperModalProps) => {
	const [crop, setCrop] = useState<Crop>({
		unit: "%",
		width: 90,
		height: 90,
		x: 5,
		y: 5,
	});
	const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	// При открытии создаём временный URL
	if (open && file && !imageUrl) {
		const url = URL.createObjectURL(file);
		setImageUrl(url);
	}

	const handleClose = () => {
		if (imageUrl) {
			URL.revokeObjectURL(imageUrl);
			setImageUrl(null);
		}
		setImageRef(null);
		setCrop({
			unit: "%",
			width: 90,
			height: 90,
			x: 5,
			y: 5,
		});
		onClose();
	};

	const handleSave = async () => {
		if (!imageRef || !crop.width || !crop.height) return;

		const canvas = document.createElement("canvas");
		const scaleX = imageRef.naturalWidth / imageRef.width;
		const scaleY = imageRef.naturalHeight / imageRef.height;
		canvas.width = crop.width;
		canvas.height = crop.height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.drawImage(
			imageRef,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		);

		const blob = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob(resolve, "image/jpeg", 0.9)
		);
		if (!blob) return;

		const croppedFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });
		onSave(croppedFile);
		handleClose();
	};

	return (
		<Modal
			title="Обрезка аватара"
			open={ open }
			onOk={ handleSave }
			onCancel={ handleClose }
			okText="Сохранить"
			cancelText="Отмена"
			width={ 600 }
			destroyOnHidden
			centered
		>
			{ imageUrl && (
				<ReactCrop
					crop={ crop }
					onChange={ (newCrop) => setCrop(newCrop) }
					keepSelection
					aspect={ aspect }
				>
					<img
						src={ imageUrl }
						alt="Crop preview"
						onLoad={ (e) => setImageRef(e.currentTarget) }
						style={ { maxWidth: "100%" } }
					/>
				</ReactCrop>
			) }
		</Modal>
	);
};

export default Cropper;