import { useRef, useState } from "react";
import { FaImage } from "react-icons/fa6";
import { useSession } from "../../../../contexts/DesignContext";

import global from "../../../../global.module.css";
import styles from "./FileUpload.module.css";
import Loading from "../../../Feedback/Loading/Loading";

const FileUpload = () => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateImageUrl } = useSession();

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/svg+xml",
  ];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload a PNG, JPEG, or JPG file.");
      return false;
    }
    if (file.size > maxFileSize) {
      setError("File size is too large. Maximum size is 5MB.");
      return false;
    }
    return true;
  };

  const handleFileChange = async (e) => {
    setIsLoading(true);

    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setError("");
      try {
        const fileUrl = URL.createObjectURL(file);
        updateImageUrl(fileUrl);
        await new Promise((res) => setTimeout(res, 500));
      } catch (err) {
        setError("Failed to upload image.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.file_upload_container}>
      <input
        type="file"
        onChange={(e) => handleFileChange(e)}
        accept=".png,.jpg,.jpeg,.svg"
        ref={fileInputRef}
        hidden
        data-testid="file-input"
      />
      <button
        title="Upload image"
        onClick={handleUploadClick}
        data-testid="upload-button"
        disabled={isLoading}
      >
        <FaImage size={28} />
      </button>

      {isLoading && (
        <Loading text="Uploading image..." type="spinner" overlay />
      )}
      {error && <p className={global.error_message}>{error}</p>}
    </div>
  );
};

export default FileUpload;
