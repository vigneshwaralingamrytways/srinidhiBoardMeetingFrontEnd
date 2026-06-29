import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Row, Col, Button, FormGroup } from "react-bootstrap";
import classes from './ChangePassword.module.css'
import { Label } from "reactstrap";

function ChangePassword(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    // Handle form submission here
    props.onSubmit(data)
    console.log(data);
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  return (
    <div style={{overflow:'hidden'}} >
       <p className={classes.login}>Change Password</p>
    <Row   className={classes.Tform}  style={{overflow:'hidden'}} >
       
        
        <Form onSubmit={handleSubmit(onSubmit)}   >
       
            <Form.Group controlId="currentPassword">
              <Form.Label className={classes.labl} >Old Password</Form.Label>
             
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Current Password" className={classes.frminput}
                  {...register("oldPassword", {
                    required: "Password is required",
                  })}
                />
               
              
              {errors.currentPassword && (
                <Form.Text className="text-danger">
                  {errors.currentPassword.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="newPassword">
              <Form.Label className={classes.labl} >New Password</Form.Label>
              
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password" className={classes.frminput}
                  {...register("newPassword", {
                    required: "New Password is required",
                  })}
                />
               
             
              {errors.newPassword && (
                <Form.Text className="text-danger">
                  {errors.newPassword.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="confirmPassword">
  <Form.Label className={classes.labl}>Confirm Password</Form.Label>
  <Form.Control
  type={showPassword ? "text" : "password"}
  placeholder="Confirm Password"
  className={classes.frminput}
  {...register("confirmPassword", {
    required: "Confirm Password is required",
    validate: {
      matchesNewPassword: (value) =>
        value === getValues("newPassword") || "Password Does Not Match",
    },
  })}
/>



             
              {errors.confirmPassword && (
                <Form.Text className="text-danger">
                  {errors.confirmPassword.message}
                </Form.Text>
              )}
            </Form.Group>
            <FormGroup>
            <Label className={classes.pswd}>

  <input
    type="checkbox"
    onClick={togglePasswordVisibility}
  />
  {showPassword ? "Hide" : "Show"} Password
</Label>
</FormGroup>

  
            <Button className={classes.bttn} type="submit">Submit</Button> 
          </Form>
         
        </Row>
        </div>
  );
}

export default ChangePassword;
