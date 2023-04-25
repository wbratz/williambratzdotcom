import React, { useEffect, useState } from 'react';
import styles from "../../styles/downloadbutton.module.css";

interface DownloadButtonProps {
  filename: string;
  content: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ filename, content }) => {
  const handleClick = () => {
    const markdownBlob = new Blob([content], { type: 'text/markdown' });
    const downloadUrl = URL.createObjectURL(markdownBlob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <button onClick={handleClick} className={styles.downloadButton}>
      Download {filename}
    </button>
  );
};

export default DownloadButton;