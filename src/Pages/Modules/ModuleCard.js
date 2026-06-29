import React from "react";
import styled from "styled-components";
import { Card } from "react-bootstrap";
import Production from "../../images/production.png";
import Stores from "../../images/stores.png";
import Purchase from "../../images/purchase.png";
import Costing from "../../images/costing.png";
import Quality from "../../images/quality.png";
import classes from './Modules.module.css'
import { Row, Col } from 'react-bootstrap';
const images = {
  "Masters": Quality,
  "Sales": Stores,
  "Production": Purchase,
  "Payments/Accounts": Quality,
  "Purchase": Costing,
  "Costing": Costing,
  "Gate Entry": Costing,

  // "Masters":Costing,
  // "Production2":Costing
};

const StyCard = styled(Card).attrs(() => ({

}))`

`;
/*
const StyCardImg = styled(Card.Img)`
  height: 11em;
  width: 10em;
  display: flex;
  justify-content: center;
  background-color: white; 
  border-radius: 0rem;
`;

const StyCardTitle = styled(Card.Title)`
  height: 0.2em;
  display: flex;
  justify-content: center;
  padding: 0.2em 0.2em 0.2em 0.2em;
  margin-top: 0.4em;
  background-color: #fa8072; 
`; */
function ModuleCard(props) {
  const moduleLift = () => {
    const selectedmodules = {
      id: props.module.module.moduleId,
      path: props.module.module.modulePath,
    };
    console.log(selectedmodules)
    props.onModuleSelect(selectedmodules);
  };

  return (


    <div className={classes.ourTeam} onClick={moduleLift}>

      <div className={classes.picture}>
        <img className={classes.imgFluid} src={images[props.module.module.moduleImage]} /> </div>
      <div className={classes.teamContent}>
        <div className={classes.name}>{props.module.module.moduleName}</div>
        <h4 className={classes.title}></h4> </div>
      <ul className={classes.social}>
        <li>
          welcome </li>
      </ul>
    </div>  


  );
}

export default ModuleCard;
