import TextField from '@mui/material/TextField';

/**
 @Author Kedar Abhyankar
 @Email krabhyankar@gmail.com
 */

function CustomTextField({id, label, value, type, onChange}) {
    return (
        <TextField
            required
            id={id}
            inputProps={{
                style: {
                    color: "white"
                }
            }}
            label={label}
            variant="outlined"
            value={value}
            type={type}
            onChange={onChange}
            />
    );
}

export default CustomTextField;