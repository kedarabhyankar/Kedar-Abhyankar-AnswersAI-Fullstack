import React, {useState} from "react";

const CustomTextArea = () => {
    const [value, setValue] = useState("");

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Do something with the value
        console.log(value);
    };

    return (
        <form onSubmit={handleSubmit}>
      <textarea
          value={value}
          onChange={handleChange}
          placeholder="Enter some text..."
      />
            <button type="submit">Submit</button>
        </form>
    );
};

export default CustomTextArea;