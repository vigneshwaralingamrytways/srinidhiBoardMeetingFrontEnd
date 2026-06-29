import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Row, Col, Button, FormGroup } from "react-bootstrap";
import classes from './ChangePassword.module.css'
import { Label } from "reactstrap";

function ForgotPassword(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    // Handle form submission here
    props.onSubmit(data)
    console.log("forgot",data);
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  return (
    <div style={{overflow:'hidden' , borderRadius:'inherit'}}  >
       <p className={classes.login}>Forgot Password</p>
    <Row   className={classes.Tform}  style={{overflow:'hidden',}} >
       
        
        <Form onSubmit={handleSubmit(onSubmit)}   >
       
           

            <Form.Group controlId="newPassword">
              <Form.Label className={classes.labl} >UserName</Form.Label>
              
                <Form.Control
                  type="text"
                  placeholder="User Name" className={classes.frminput}
                  {...register("userName", {
                    required: "User Name is required",
                  })}
                />
               
             
              {errors.newPassword && (
                <Form.Text className="text-danger">
                  {errors.newPassword.message}
                </Form.Text>
              )}
            </Form.Group>

           <FormGroup>
            <Label className={classes.pswd}>
</Label>
</FormGroup>

                <Row>
                    <Col md={3}>
                <Button className={classes.bttn} md={3} size="sm" type="submit">Submit</Button> 
                </Col><Col md={3}>
                    <Button variant="danger" className={classes.bttn} md={3}  size="sm" type="submit" onClick={props.onCancel}>Cancel</Button>
                    </Col>
                     </Row>
            
          </Form>
         
        </Row>
        </div>
  );
}

export default ForgotPassword;
