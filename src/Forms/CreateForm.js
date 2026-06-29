import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
// import Moment from 'react-moment';
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  // InputGroup,
  // FormControl
} from "react-bootstrap";
 
import { Controller, useForm } from "react-hook-form";
import classes from "./CreateForm.module.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AuthContext from "./Store/auth-context";
import FormControl from '@mui/material/FormControl';
//import Select from '@mui/material/Select';
import Typeahead from "react-bootstrap-typeahead/types/core/Typeahead";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import QRCode from 'qrcode.react';
import jsQR from 'jsqr';
import * as FaIcons from 'react-icons/fa';
/* import { format, addDays } from "date-fns"; */
import Select from "react-select";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Datetime from 'react-datetime';
import { format } from 'date-fns';
 
import ReactQuill from "react-quill";
const getRowwise = (array, rowWise) => {
  let result = [],
    i = 0;
  while (i < array.length) result.push(array.slice(i, (i += rowWise)));
  //  i.log(result)
  return result;
};


const renderFields = (
  fields,
  rowwise,
  watchValues,
  register,
  errors,
  setValue,
  getValues,
  handleImageUpload,
  rowcolumns,
  rowColors,
  defaultRowColor,
  dynamicclassname, watch, resetvalues, setSelectedOption, selectedOption, setMultiSelectedOption, multiSelectedOption, control

) => {
  const mdSize = parseInt(12 / rowwise);

  const groupedFields = fields.reduce((acc, field) => {
    acc[field.legend] = acc[field.legend] || [];
    acc[field.legend].push(field);
    return acc;
  }, {});



  return Object.entries(groupedFields).map(([legend, legendFields], index) => (
    <div key={index} style={legend && legend !== "undefined" ? { marginBottom: "10px", } : {}}>
      {/*padding: "0rem 6rem" */}
      {!legendFields.some(field => field.bgOnly) && legend && legend !== "undefined" && (
        <fieldset style={{
          border: "1px solid black", backgroundColor: "#3d3c40", color: "white",
          borderRadius: ".5rem .5rem 0 0", display: "flex", justifyContent: "center"
        }}>
          <legend style={{
            display: "flex", justifyContent: "center"
          }}>{legend}</legend>
        </fieldset>
      )}
      <Container fluid
        key={index}
        style={{
          backgroundColor: (rowColors && rowColors[index]) || (defaultRowColor &&
            defaultRowColor), borderRadius: "0 0  .5rem .5rem", paddingBottom: "1rem",
          borderRadius: legendFields.some(field => field.bgOnly) ? ".5rem .5rem .5rem .5rem" : "0",
          padding: legendFields.some(field => field.bgOnly) ? "1rem .5rem 1rem .5rem" : ".5rem .5rem 1rem .5rem",
        }}


      >
        <Row className={classes.formmainRow} >
          {legendFields.map((field, fieldIndex) => {
            let {
              title,
              type,
              name,
              contains,
              validationProps,
              dynamic,
              options,
              inpprops,
              value,
              colMdSize,
              horizontal
            } = field;

            // let showField = dynamic ? watchValues[dynamic["field"]] === dynamic["value"] : true;
            let showField = dynamic
              ? String(watch(dynamic["field"])) === String(dynamic["value"])
              : true;
            if (!showField) return null;


            switch (type) {
              case "test":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
                      <Form.Label
                        htmlFor={name}
                        className={horizontal ? classes.horizontallabel : undefined}
                        style={{ whiteSpace: horizontal ? "wrap" : "normal", minWidth: horizontal ? "210px" : "auto" }}
                      >
                        {title}
                      </Form.Label>
                      <Select
                        id={name}
                        name={name}
                        {...register(name, { required: validationProps })}
                        options={options}
                        onChange={(selectedOption) => {
                          setSelectedOption(selectedOption)
                          setValue(name, resetvalues ? "" : selectedOption.value, { /* shouldValidate: true  */ });
                        }}
                        // value={selectedOption}
                        value={options.filter((option) =>
                          getValues(name) == (option.value)
                        )}
                        styles={{
                          control: (styles) => ({
                            ...styles,
                            border: 'none',
                            background: 'transparent',
                            boxShadow: 'none',
                            borderRadius: 'none',
                            borderBottom: '1px solid #000',
                          }),
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                          indicatorSeparator: (styles) => ({
                            display: 'none',
                          }),
                          dropdownIndicator: (styles) => ({
                            ...styles,
                            color: '#000',
                            '&:hover': {
                              color: '#000',
                            },
                          }),
                        }}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );

              case "mulitioptions":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
                      <Form.Label
                        htmlFor={name}
                        className={horizontal ? classes.horizontallabel : undefined}
                        style={{ whiteSpace: horizontal ? "wrap" : "normal", minWidth: horizontal ? "210px" : "auto" }}
                      >
                        {title}
                      </Form.Label>
                      <Select
                        id={name}
                        name={name}
                        {...register(name, {
                          required: validationProps,
                          validate: (value) => {
                            // If inpprops.isAvailable is true, return an error message
                            if (inpprops?.isAvailable) {
                              return inpprops?.errorMsg || "Please Select Valid Field";
                            }

                            // If validation passes, return true (no error)
                            return true;
                          },
                        })}
                        options={options}
                        isMulti
                        onChange={(selectedOptions) => {
                          setMultiSelectedOption(selectedOptions);
                          setValue(name, resetvalues ? [] : selectedOptions.map(option => option.value), { /* shouldValidate: true  */ });
                        }}
                        value={multiSelectedOption}
                        styles={{
                          control: (styles) => ({
                            ...styles,
                            border: 'none',
                            background: 'transparent',
                            boxShadow: 'none',
                            borderRadius: 'none',
                            borderBottom: '1px solid #000',
                          }),
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                          indicatorSeparator: (styles) => ({
                            display: 'none',
                          }),
                          dropdownIndicator: (styles) => ({
                            ...styles,
                            color: '#000',
                            '&:hover': {
                              color: '#000',
                            },
                          }),
                        }}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );

              case "searchMultipleSelect":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Autocomplete
                        multiple
                        id={name}
                        options={options}
                        getOptionLabel={(option) => option.label}
                        onChange={(e, values) => {
                          // Extracting values from selected options
                          const selectedValues = values.map((value) => value.value);
                          // Setting the extracted values to the key
                          setValue(name, selectedValues);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label={title} variant="outlined" />
                        )}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                      <input
                        type="hidden"
                        id={name}
                        {...register(name, { required: validationProps })}
                      />
                    </Form.Group>
                  </Col>
                );
              case "searchSingleSelect":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
                      <Form.Label
                        htmlFor={name}
                        className={horizontal ? classes.horizontallabel : undefined}
                        style={{ whiteSpace: horizontal ? "wrap" : "normal", minWidth: horizontal ? "210px" : "auto" }}
                      >
                        {title}
                      </Form.Label>
                      <Select
                        id={name}
                        name={name}
                        {...register(name, { required: validationProps })}
                        options={options}
                        onChange={(selectedOption) => {
                          setSelectedOption(selectedOption)
                          setValue(name, resetvalues ? "" : selectedOption.value, { /* shouldValidate: true  */ });
                        }}
                        // value={selectedOption}
                        value={options.filter((option) =>
                          getValues(name) == (option.value)
                        )}
                        styles={{
                          control: (styles) => ({
                            ...styles,
                            border: 'none',
                            background: 'transparent',
                            boxShadow: 'none',
                            borderRadius: 'none',
                            borderBottom: '1px solid #000',
                          }),
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                          indicatorSeparator: (styles) => ({
                            display: 'none',
                          }),
                          dropdownIndicator: (styles) => ({
                            ...styles,
                            color: '#000',
                            '&:hover': {
                              color: '#000',
                            },
                          }),
                        }}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
              /*   case "text":
                  return (
                    <Col md={colMdSize ? colMdSize : mdSize}>
                      {" "}
                      <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
  
                        <Form.Label htmlFor={name}
                          className={horizontal ? classes.horizontallabel : undefined}
                          style={{ whiteSpace: horizontal ? "wrap" : "normal", minWidth: horizontal ? "210px" : "auto" }}>{title}</Form.Label>
                        <Form.Control
                          type={contains}
                          id={name}
                          {...register(name, validationProps)}
                          minLength={inpprops.minlength}
                          maxLength={inpprops.maxlength}
                          // pattern={inpprops.pattern}
                          className={dynamicclassname ? `${classes[dynamicclassname]}` : horizontal ? `${classes.horizontalText}` : classes.formBorder}
                        />
                        {errors[name] && (
                          <Form.Text className="text-danger">
                            {errors[name]["message"]}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  ); */
              case "richtext":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
                      <Form.Label
                        htmlFor={name}
                        className={horizontal ? classes.horizontallabel : undefined}
                        style={{ whiteSpace: horizontal ? "wrap" : "normal", minWidth: horizontal ? "210px" : "auto" }}
                      >
                        {title}
                      </Form.Label>

                      <ReactQuill
                        theme="snow"
                        value={getValues(name) || ""}
                        onChange={(content) => {
                          setValue(name, content, { shouldValidate: true });
                        }}
                        style={{ height: "auto", marginBottom: "2" }}
                      />

                      {/* Hidden input to register with react-hook-form */}
                      <input
                        type="hidden"
                        id={name}
                        {...register(name, { required: validationProps })}
                      />

                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );


              case "text":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
                      <Form.Label htmlFor={name}
                        className={horizontal ? classes.horizontallabel : undefined}
                        style={{ whiteSpace: horizontal ? "wrap" : "normal", minWidth: horizontal ? "210px" : "auto" }}>{title}</Form.Label>
                      <Form.Control
                        type={contains}
                        id={name}
                        {...register(name, {
                          required: validationProps,

                          pattern: inpprops?.pattern
                            ? {
                              value: inpprops.pattern.value,
                              message: inpprops.pattern.message || "Invalid format",
                            }
                            : undefined,
                          validate: value => {
                            const numberPattern = /^[-+]?(?:\d+|\.\d+|\d+\.\d+)$/;
                            const specialCharPattern = /[!@#$%^&*(),?":{}|<>]/g;

                            // Round up max value to next integer if it has decimal
                            // const maxValue = inpprops?.max && inpprops.max % 1 !== 0 ? Math.ceil(inpprops.max) : inpprops?.max;

                            if (inpprops?.min && parseFloat(value) < inpprops.min) {
                              return `Value should be greater than or equal to ${inpprops.min}`;
                            }
                            if (inpprops?.max && parseFloat(value) > inpprops.max) {
                              return `Value should be less than or equal to ${inpprops.max}`;
                            }
                            if ((inpprops?.min || inpprops?.max) && specialCharPattern.test(value)) {
                              return 'Special characters are not allowed';
                            }
                            if ((inpprops?.min || inpprops?.max) && !numberPattern.test(value)) {
                              return 'Only positive or negative rounded decimal values are allowed';
                            }
                            if (inpprops?.isAvailable) {
                              return inpprops?.errorMsg || "Please Select Valid Field";
                            }

                            return true;
                          }
                        })}
                        autoComplete={inpprops?.autoComplete || "off"}
                        minLength={inpprops?.minlength}
                        maxLength={inpprops?.maxlength}
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : horizontal ? `${classes.horizontalText}` : classes.formBorder}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name].message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );

              case 'datepicker':
                const watchedValue = watch(name);
                const resetdate = !watchedValue;
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
                      <Form.Label htmlFor={name} className={horizontal ? classes.horizontallabel : undefined} style={{ whiteSpace: horizontal ? "wrap" : "normal", minWidth: horizontal ? "210px" : "auto" }}>{title}</Form.Label>
                      <div className={`col ${dynamicclassname ? classes[dynamicclassname] : horizontal ? classes.horizontalText : classes.formBorder}`}>
                        <DatePicker
                          selected={watchedValue ? new Date(watchedValue) : resetvalues ? null : new Date()} // Ensure to convert the value to a Date object

                          // Ensure to convert the value to a Date object
                          onChange={(date) => {
                            setValue(name, date.toISOString().split('T')[0], { shouldValidate: true });
                          }}
                          dateFormat="dd-MM-yyyy"
                          className={dynamicclassname ? `${classes[dynamicclassname]}` : horizontal ? `${classes.horizontalText}` : classes.formBorder}
                        />
                      </div>
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );


              case "disabled":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        type={contains}
                        id={name}
                        {...register(name)}
                        readOnly
                        value={value}
                        disabled
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}


                      />
                    </Form.Group>
                  </Col>
                );
              case "readonlyDate":
                const isoValue = value; // "2025-07-03"
                const displayValue = format(new Date(isoValue), "dd/MM/yyyy");

                // Push ISO value into RHF for tracking
                useEffect(() => {
                  setValue(name, isoValue);  // ensures watch() returns ISO format
                }, [name, isoValue, setValue]);

                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        type="text"
                        id={name}
                        readOnly
                        value={displayValue} // only formatted shown
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}
                        {...register(name, {
                          required: validationProps, validate: value => {
                            if (inpprops.dateValidation) {
                              return inpprops?.errorMsg ? inpprops?.errorMsg : "Please Enter Correct Date"
                            }
                          }
                        })}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );



              case "hidden":
                return (
                  <Form.Group key={name}>
                    <Form.Control
                      type="hidden"
                      id={name}
                      {...register(name)}
                      value={value ? value : ""}
                      className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}


                    />
                  </Form.Group>
                );

              /*     case 'time':
                    return (
                      <Col md={colMdSize ? colMdSize : mdSize}>
                        <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
                          <Form.Label htmlFor={name} className={horizontal ? classes.horizontallabel : undefined} style={{ whiteSpace: horizontal ? "wrap" : "normal" ,minWidth: horizontal ? "210px": "auto"}}>{title}</Form.Label>
                          <DatePicker
                            id={name} // Ensure the id matches the name for register to work correctly
                            {...register(name, { required: validationProps })}
                            selected={watch(name) /* || new Date() }
                            onChange={(date) => setValue(name, date, { shouldValidate: true })}
                            showTimeSelect
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className={dynamicclassname ? `${classes[dynamicclassname]}` : horizontal ? `${classes.horizontalText}` : classes.formBorder}
                          />
                          {errors[name] && (
                            <Form.Text className="text-danger">
                              {errors[name]["message"]}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                    ); */

              /*    case 'timer':
                   return (
                     <Col md={colMdSize ? colMdSize : mdSize}>
                       <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
                         <Form.Label htmlFor={name} className={horizontal ? classes.horizontallabel : undefined} style={{ whiteSpace: horizontal ? "wrap" : "normal", minWidth: horizontal ? "210px" : "auto" }}>{title}</Form.Label>
                         <DatePicker
                           selected={watch(name) || new Date()} // Use the selected value or default to current date
                           onChange={(date) => setValue(name, date, { shouldValidate: true })}
                           showTimeSelect
                           timeIntervals={15}
                           dateFormat="yyyy-MM-dd HH:mm"
                           className={dynamicclassname ? `${classes[dynamicclassname]}` : horizontal ? `${classes.horizontalText}` : classes.formBorder}
                         />
                         {errors[name] && (
                           <Form.Text className="text-danger">
                             {errors[name]["message"]}
                           </Form.Text>
                         )}
                       </Form.Group>
                     </Col>
                   );
    */

              /*    case 'time':
                   return (
                     <Col md={colMdSize ? colMdSize : mdSize}>
                       <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
                         <Form.Label htmlFor={name} className={horizontal ? classes.horizontallabel : undefined} style={{ whiteSpace: horizontal ? "wrap" : "normal", minWidth: horizontal ? "210px" : "auto" }}>{title}</Form.Label>
                         <Form.Control
                           type="datetime-local"
                           id={name}
                           {...register(name, { required: validationProps })}
                           defaultValue={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16)}
                           className={dynamicclassname ? `${classes[dynamicclassname]}` : horizontal ? `${classes.horizontalText}` : classes.formBorder}
                         />
                         {errors[name] && (
                           <Form.Text className="text-danger">
                             {errors[name]["message"]}
                           </Form.Text>
                         )}
                       </Form.Group>
                     </Col>
                   ); */


              // Inside your component function
              case 'time':
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
                      <Form.Label htmlFor={name} className={horizontal ? classes.horizontallabel : undefined} style={{ whiteSpace: horizontal ? "wrap" : "normal", minWidth: horizontal ? "210px" : "auto" }}>{title}</Form.Label>
                      <DatePicker
                        selected={watch(name) ? new Date(watch(name)) : null  /* || new Date() */} // Use the selected value or default to current date
                        onChange={(date) => setValue(name, date, { shouldValidate: true })}
                        showTimeSelect
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd HH:mm"
                        // className={dynamicclassname ? `${classes[dynamicclassname]}` : horizontal ? `${classes.horizontalText}` : classes.formBorder}
                        className={`form-control ${dynamicclassname ? classes[dynamicclassname] : horizontal ? classes.horizontalText : classes.formBorder}`}
                        wrapperClassName="d-block w-100"
                      />
                      <input
                        type="hidden"
                        id={name}
                        {...register(name, { required: validationProps })}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );

              case 'datepickertest':
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name} className={horizontal ? classes.horizontal : undefined}>
                      <Form.Label htmlFor={name} className={horizontal ? classes.horizontallabel : undefined} style={{ whiteSpace: horizontal ? "wrap" : "normal", minWidth: horizontal ? "210px" : "auto" }}>{title}</Form.Label>
                      <DatePicker
                        selected={watch(name)}
                        onChange={(date) => {
                          setValue(name, date.toISOString().split('T')[0], { shouldValidate: true });
                        }}
                        dateFormat="dd-MM-yyyy"
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : horizontal ? `${classes.horizontalText}` : classes.formBorder}
                      />

                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );

              case "textarea":
                return (
                  <Col md={inpprops.md || 12}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name} >{title}</Form.Label>
                      <Form.Control
                        as={contains}
                        id={name}
                        {...register(name, { required: validationProps })}
                        maxLength={inpprops.maxlength}
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}
                        rows={inpprops?.rows || 3}

                        style={{
                          height: inpprops?.height ? inpprops.height : '20px',
                          minHeight: inpprops?.minHeight ? inpprops.minHeight : "20px"
                        }}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
              case "textarea1":
                return (
                  <Col md={inpprops.md}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name} >{title}</Form.Label>
                      <Form.Control
                        as={contains}
                        id={name}
                        {...register(name, { required: validationProps })}
                        maxLength={inpprops.maxlength}
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder1}
                        disabled={inpprops?.disable}

                        style={{ height: '20px !important' }}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                ); case "searchMultipleSelected":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Autocomplete
                        multiple
                        id={name}
                        options={options}
                        value={watch(name) || []}
                        onChange={(e, values) => {
                          const uniqueValues = values.filter(
                            (v, i, arr) => arr.findIndex(x => x.value === v.value) === i
                          );
                          setValue(name, uniqueValues, { shouldValidate: true });
                        }}
                        getOptionLabel={(opt) => opt?.label ?? ""}
                        isOptionEqualToValue={(opt, val) => opt.value === val.value} // ?? this ensures proper comparison
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            placeholder="Select"
                            sx={{ mt: 1 }}
                            InputProps={{
                              ...params.InputProps,
                              disableUnderline: false,
                            }}
                          />
                        )}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                      <input
                        type="hidden"
                        id={name}
                        {...register(name, { required: validationProps })}
                      />
                    </Form.Group>
                  </Col>
                );
              case "number":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        type={contains}
                        id={name}
                        min={inpprops?.min ? inpprops.min : 0}
                        step={inpprops?.step ? inpprops.step : 0.0000001}
                        max={(inpprops?.max || inpprops?.max >= 0) && inpprops.max}
                        {...register(name, { required: validationProps })}
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}


                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
              case "password":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        type={contains}
                        id={name}
                        min={inpprops?.min ? inpprops.min : 0}
                        step={inpprops?.step ? inpprops.step : 0.0000001}
                        max={(inpprops?.max || inpprops?.max >= 0) && inpprops.max}
                        {...register(name, { required: validationProps })}
                        autoComplete={inpprops?.autoComplete || "new-password"}
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}


                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );

              case "date":

                // const todayDate = new Date().toISOString().split('T')[0];

                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name} >{title}</Form.Label>

                      <Form.Control
                        type={contains}
                        id={name}
                        format={inpprops?.format}
                        value={watch(name)}


                        //calender will open if we click both icon & input box
                        onClick={
                          (e) => {
                            // e.target.showPicker?.() ;
                            // console.log("both clicable:",e.target.value);}}

                            try {
                              setTimeout(() => {
                                e.target.showPicker?.();
                              }, 0);


                            }
                            catch (err) {
                              console.log("this  is onfocus err:", err)
                            }
                          }
                        }

                        // onClick={(e)=>{
                        //    e.target.showPicker?.() ;
                        // }}

                        // onClick={
                        //   (e) => {
                        //   //   e.target.showPicker?.() ;
                        //   // console.log("both clicable:",e.target.value);

                        // try{
                        //     e.target.showPicker?.() ;

                        // }
                        // catch(err){
                        // console.log("this onclik err:",err)
                        // }
                        // }
                        // }

                        // showOnFocus
                        {...register(name, {
                          required: validationProps, validate: value => {
                            if (inpprops.dateValidation) {
                              return inpprops?.errorMsg ? inpprops?.errorMsg : "Please Enter Correct Date"
                            }
                          }
                        })}
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}


                      />


                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
              case "checkboxdropdown":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize} key={name}>
                    <Form.Group>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <FormControl sx={{ m: 1, width: "100%" }}>
                        <InputLabel id={`${name}-label`}>{title}</InputLabel>
                        <Select
                          labelId={`${name}-label`}
                          id={name}
                          multiple
                          value={watchValues[name] || []}
                          onChange={(event) => {
                            const selectedOptions = Array.from(event.target.options)
                              .filter((option) => option.selected)
                              .map((option) => option.value);
                            setValue(name, selectedOptions.length ? selectedOptions : null);
                          }}

                        >
                          {options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Checkbox
                                checked={watchValues[name] && watchValues[name].includes(option.value)}
                              />
                              <ListItemText primary={option.label} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );

              case 'typehead':
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>   <Form.Group key={name}>
                    <Form.Label htmlFor={name}>{title}</Form.Label>
                    <Typeahead
                      id={name}   {...register(name, { required: validationProps })} className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}


                      labelKey={name}

                      options={options}
                      placeholder="Choose a state..."

                    />
                  </Form.Group></Col>
                )
              case "select":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name} >{title}</Form.Label>
                      <Form.Select
                        id={name}
                        {...register(name, {
                          required: validationProps, validate: value => {
                            if (inpprops?.isAvailable) {
                              console.log("true =====>", inpprops?.errorMsg)
                              return inpprops?.errorMsg || "Please Select Valid Field";
                            }
                            return true;
                          }
                        })}
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}


                      >
                        {options.map(({ value, label, group }, index) => {
                          if (group) {
                            const isGroupRendered = options.slice(0, index).some(opt => opt.group === group);
                            return isGroupRendered ? null : (
                              <optgroup label={group} key={group}>
                                {options.filter(opt => opt.group === group).map(opt => (
                                  <option value={opt.value} key={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </optgroup>
                            );
                          } else {
                            return <option value={value} key={index}>{label}</option>;
                          }
                        })}
                      </Form.Select>
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
              case "disabledDate":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name} >{title}</Form.Label>
                      <Form.Control
                        type="date"
                        id={name}
                        defaultValue={new Date().toISOString().split('T')[0]}
                        min={new Date().toISOString().split('T')[0]}
                        max={new Date().toISOString().split('T')[0]}
                        {...register(name, { required: validationProps })}
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}


                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );

              case "Document":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        type="file"
                        id={name}
                        format={inpprops?.format}
                        {...register(name, { required: validationProps })}
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}


                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
              case "qrcode":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        type="file"
                        id={name}
                        format={inpprops?.format}
                        {...register(name, { required: validationProps })}
                        onChange={handleImageUpload}
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}


                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );

              case "checkbox":
                return (
                  <div key={name}>
                    <label>
                      <input
                        type="checkbox"
                        id={name}
                        {...register(name, { required: validationProps })}
                        className={dynamicclassname ? `${classes[dynamicclassname]}` : classes.formBorder}


                      />
                      <span>{title}</span>
                      {errors[name] && (
                        <span className="red-text">
                          {errors[name]["message"]}
                        </span>
                      )}
                    </label>
                  </div>
                );

              case "radio":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    <Form.Group key={name}>
                      <Form.Label>{title}</Form.Label>
                      <div>
                        {options.map((opt) => (
                          <Form.Check
                            key={opt.value}
                            type="radio"
                            label={opt.label}
                            name={name}
                            value={opt.value}
                            checked={watch(name) === opt.value}
                            onChange={(e) => setValue(name, e.target.value)}
                          />
                        ))}
                      </div>
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name].message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );

              default:
                return (
                  <div key={name}>
                    <span className="red-text">Invalid Field</span>
                  </div>
                );
            }
          })}
        </Row>
      </Container>
    </div>
  ));
};

function CreateForm({
  template,
  watchFields,
  rowwise,
  validate,
  onSubmit,
  onCancel,
  buttonName,
  btButtons,
  defaultValues,
  styles,
  onScanSubmit, rowcolumns, rowColors, defaultRowColor, dynamicclassname, control,
}) {


  // useEffect(() => { console.log({...values}) }, [])
  // const defValues = defaultValues;
  const [uploadedImage, setUploadedImage] = useState(null);
  const [decodedResult, setDecodedResult] = useState("");
  const [lock, setLock] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [multiSelectedOption, setMultiSelectedOption] = useState(null);
  const showButton = () => setLock(!lock);
  //const [defValues,setDefValues] = useState(defaultValues);
  console.log("Dynamic Class Name:", dynamicclassname);
  const authCtx = useContext(AuthContext);
  //  let userId =authCtx.userId;

  let {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: { ...defaultValues },
  });
  let { heading, fields } = template;
  fields = [
    ...fields,
    {
      type: "hidden",
      name: "updatedBy",
      contains: "hidden",
      value: localStorage.userId,
    },
    //{
    //   type: "hidden",
    //   name: "updatedOn",
    //   contains: "datetime",
    //   value: new Date().toISOString(),
    // },
  ];
  // handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setDecodedResult(''); // Clear the previous decoded result

      };
      reader.readAsDataURL(file);
    }

  }

  // scan QR code from uploaded image
  const scanQRCode = () => {
    if (uploadedImage) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          setDecodedResult(code.data);
          onScanSubmit(code.data);
          setUploadedImage(null); // Clear the uploaded image
          reset()

        } else {
          setDecodedResult('No QR code found in the uploaded image.');
        }
      };
      img.src = uploadedImage;
    } else {
      setDecodedResult('Please upload an image before scanning.');
    }
  }
  let watchValues = watchFields ? watch(watchFields) : watch();
  // validate(watchValues, { errors, setError, clearErrors, setValue, getValues });
  useEffect(() => {

    if (validate) {
      validate(watchValues, { errors, setError, clearErrors, setValue, getValues });
    }
  }, [JSON.stringify(watchValues)]);
  //console.log({...defaultValues})
  const resetForm = (defValues) => {
    var time = Date().toLocaleString();
    JSON.stringify(defaultValues) === "{}"
      ? reset({ time: Date().toLocaleString() })
      : reset(defaultValues);
  };

  useEffect(() => {
    resetForm(defaultValues);
  }, [defaultValues]);
  let resetvalues = false
  const onSubmitForm = (values, e) => {

    values.clicked = e.nativeEvent.submitter.name;
    console.log(e.nativeEvent.submitter.name);
    const { fields } = template;
    const datepickerNames = fields.filter(field => field.type === 'datepicker').map(field => field.name);
    const searchSelect = fields.filter(field => field.type === 'searchSingleSelect').map(field => field.name);
    console.log("datepickerNames", datepickerNames);
    console.log("searchSelectNames", searchSelect);

    const searchMultiSelect = fields.filter(field => field.type === 'mulitioptions').map(field => field.name);
    if (e.nativeEvent.submitter.name === "Scan") {
      scanQRCode()

    } else {
      // Otherwise, send the regular form values to onSubmit
      onSubmit(values);
      if (!["Search", "Export Excel", "excel", "prexcel"].includes(e.nativeEvent.submitter.name)) {
        e.target.reset();
        // Ensure datepickerNames is an array before calling forEach
        if (Array.isArray(datepickerNames)) {
          resetvalues = true
          datepickerNames.forEach(name => setValue(name, ""));
        }
        if (searchSelect) {
          resetvalues = true
          searchSelect.forEach(name => setValue(name, ""));
          setSelectedOption(null);
        }

        if (searchMultiSelect) {
          resetvalues = true
          searchMultiSelect.forEach(name => setValue(name, []));
          setMultiSelectedOption(null);
        }
      }
    }
  };



  const dynamicStyles = typeof styles === "undefined" ? {} : styles;
  return (
    <Row className={classes.formholder}
    >
      <Form
        onSubmit={handleSubmit(onSubmitForm)}
        className={classes.formcon}
        style={{
          ...dynamicStyles?.upper,
          ...(dynamicStyles?.upper ? {} : { background: "transparent" }),
        }}
      >
        {heading && (
          <>
            <div className={classes.tlhead}>
              <Card
                body
                className={classes.title}
                style={{
                  ...dynamicStyles?.uppertitle,
                  ...(dynamicStyles?.uppertitle ? {} : { padding: "0" }),
                }}
              >
                <Row>
                  <Col md={12}>
                    {" "}
                    <h4>{heading}</h4>{" "}
                  </Col>
                </Row>
              </Card>
            </div>
          </>
        )}{" "}
        <Row
          style={{
            ...dynamicStyles?.upperRow,
            ...(dynamicStyles?.upperRow ? {} : { background: "transparent" }),
            border: "none", margin: 0
          }}
        >
          {renderFields(
            fields,
            rowwise,
            watchValues,
            register,
            errors,
            setValue, getValues, handleImageUpload, rowcolumns, rowColors, defaultRowColor,
            dynamicclassname, watch, resetvalues, setSelectedOption, selectedOption, setMultiSelectedOption, multiSelectedOption, control

          )}
        </Row>
        {/*   <Row>{btButtons && btButtons}</Row>
        {buttonName && (<div style={{
          display: 'flex', flexDirection: "row",
          justifyContent: 'space-between', padding: "0 2rem", alignItems: "center"
        }}>
          <div onClick={showButton}> <label className={classes.checkboxContainer}
          >
            <input type='checkbox' name='' className={classes.checkbox} />
          

          </label></div>
          <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}> {buttonName && (
            <Button type="submit" name={buttonName}

              className={classes.btn}
              disabled={lock}>
              {buttonName}
            </Button>
          )}
            {buttonName && (
              <Button
                type="button"
                variant="danger" name="cancelButt"
                className={classes.btn}
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>)}
      </Form> */}
        <Row style={{ margin: "0", padding: "0" }}>{btButtons && btButtons}</Row>
        <Row className="col-12 d-flex justify-content-end">
          {buttonName && (
            <Button type="submit" name={buttonName} className={classes.btn}>
              {buttonName}
            </Button>
          )}
          {buttonName && (
            <Button
              type="button"
              variant="danger" name="cancelButt"
              className={classes.btn}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </Row>
      </Form>
    </Row>
  );
}
export default CreateForm;
