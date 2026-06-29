import React,{useEffect,useCallback,useState,useLocalStorage} from 'react'
import{ModulesData} from "./ModulesData"
import { Container,Row,Col} from 'react-bootstrap';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';
import ModuleCard from './ModuleCard';
import { IconContext } from 'react-icons/lib';
import classes from './Modules.module.css'
import {moduleActions} from '../../store/module-slice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useFetch, { Provider } from "use-http";
import api from "../../Api";
import { useMediaQuery } from "@mui/material";

const getRowwise=(array,rowWise)=>{
  let result = [],
      i = 0;
  while (i < array.length) result.push(array.slice(i, i += rowWise));
  console.log(result)
  return result;
}

function Modules() {
  const history = useHistory()
  let role = localStorage.getItem('roleId');;
  const authCtx = useContext(AuthContext);
  const { get, post,request, response, loading, error} = useFetch({ data: [] });
  const [modules,setModules] = useState([]);
  const loadInitialData = useCallback(async () => {
    // const { ok } = response // BAD, DO NOT DO THIS
    const initialModules = await post(api + "/loadMenu/loadModules",{"roleId":role});
    console.log(initialModules)
    if (response.ok) setModules(initialModules);
    //  console.log(initialCusts)
  }, [get, response]);
  //const modules = authCtx.modules;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      moduleActions.selectModuleId({
        moduleId:""
      })
    );
  }, []);
  useEffect(() => {
    loadInitialData();
}, []);
const isMobile = useMediaQuery('(max-width: 600px)');
  const cardsPerRow = isMobile ? 2 : 4;
  const addmodules = (selectedmodule) => {
    dispatch(
      moduleActions.selectModuleId({
        moduleId:selectedmodule.id
      })
    );
    history.push(selectedmodule.path)
  };
  
  const renderModules = (modules) => {
    const groupedModules = getRowwise(modules, cardsPerRow);
  
    return (
      <div>
        {groupedModules.map((rowModules, index) => {
          return (
            <Container fluid key={index} className={classes.Container}
            >
              <Row >
                {rowModules.map((module, moduleIndex) => {
                  return (
                    <Col key={moduleIndex} lg={3} md={6} xs={6} >
                      <ModuleCard module={module} onModuleSelect={addmodules} />
                    </Col>
                  );
                })}
              </Row>
            </Container>
          );
        })}
      </div>
    );
  };
  

  return (
    <IconContext.Provider value={{ color: '#FFF' }}>
        {renderModules(modules)}
    </IconContext.Provider>
  )
}

export default Modules
