import styles from "./SvgPreview.module.css";

const SvgPreview = ({ svgUrl, scale, templateType }) => {
  const canvasSizePx =
    templateType === "text" ? 110 * scale * 2.5 : 110 * scale;

  return (
    <div className={styles.ball_displays} data-testid="svg-preview">
      <div className={styles.golf_template}>
        <img
          src={svgUrl}
          alt="Uploaded"
          className={styles.upload_img}
          style={{ width: `${canvasSizePx}px` }}
          data-testid="preview-scaled"
        />
      </div>
      <div className={styles.life_size}>
        <p>Life Size</p>
        <div className={styles.golf_real_size}>
          <img
            src={svgUrl}
            alt="Life-size preview"
            className={styles.upload_img}
            style={{ width: `${(canvasSizePx * 210) / 500}px` }}
            data-testid="preview-life-size"
          />
        </div>
      </div>
    </div>
  );
};

export default SvgPreview;
