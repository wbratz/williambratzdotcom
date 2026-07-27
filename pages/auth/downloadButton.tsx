import React, { useEffect, useState } from 'react';
import Head from 'next/head';
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
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <button onClick={handleClick} className={styles.downloadButton}>
        Download {filename}
      </button>
    </>
  );
};

export default DownloadButton;
