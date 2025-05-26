import "./EmailInput.module.css";
import input_styles from "../UserInformation.module.css";

const EmailInput = ({ value, setValue, setComplete }) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    const emailValue = e.target.value;
    setValue(emailValue);
    setComplete(emailRegex.test(emailValue));
  };

  return (
    <div className={input_styles.input_item}>
      <label className={input_styles.input_label}>Email</label>
      <input type="email" value={value} onChange={handleChange} />
    </div>
  );
};

export default EmailInput;
