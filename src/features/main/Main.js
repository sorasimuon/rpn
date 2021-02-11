import React, { useState, useEffect } from "react";
import axios from "./../../app/axios";

// Styling
import { IconButton, makeStyles } from "@material-ui/core";
import styles from "./Main.module.css";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

import { teal, deepOrange, lightBlue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  newStackButton: {
    flex: 1,
    backgroundColor: teal[500],
    "&:hover": {
      backgroundColor: teal[300],
    },
    "&:focus": {
      outline: "none",
    },
  },
  newStackIcon: {
    width: 64,
    height: 64,
    backgroundColor: "inherit",
    color: "white",
  },
  inputArea: {
    padding: 10,
    fontSize: 44,
    gridColumn: "1 / 3",
    gridRow: "1/2",
    borderRadius: 20,
    border: "none",
    "&:focus": {
      outline: "none",
    },
  },
  inputButton: {
    backgroundColor: deepOrange[500],
    gridColumn: "1 / 3",
    gridRow: "2/3",
    borderRadius: 20,
    border: "none",
    color: "white",
    fontSize: 44,
    "&:focus": {
      outline: "none",
    },
  },
  operatorButton: {
    backgroundColor: lightBlue[50],
    borderRadius: 20,
    border: "none",
    color: "black",
    fontSize: 44,
    "&:focus": {
      outline: "none",
    },
  },
  stackSelector: {
    backgroundColor: "inherit",
    fontSize: 44,
    border: "none",
    "&:focus": {
      outiline: "none",
    },
  },
  label: {
    marginTop: 0,
    fontSize: 22,
  },
  stackDisplay: {
    wordBreak: "break-all",
  },
  deleteStackButton: {
    flex: 1,
    backgroundColor: deepOrange[500],
    "&:hover": {
      backgroundColor: deepOrange[300],
    },
    "&:focus": {
      outline: "none",
    },
  },
  deleteStackIcon: {
    width: 44,
    height: 44,
    backgroundColor: "inherit",
    color: "white",
  },
  main__errorArea: {
    color: "red",
  },
}));

function Main() {
  const classes = useStyles();

  const [number, setNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStackID, setCurrentStackID] = useState(null);
  const [currentStack, setCurrentStack] = useState(null);

  const [listStacks, setListStacks] = useState([]);

  const selectStack = (id) => {
    for (let stack of listStacks) {
      if (stack._id == parseInt(id)) {
        setCurrentStackID(parseInt(id));
        setCurrentStack(stack.stack);
        break;
      }
    }
  };

  const newStack = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/rpn/stack");
      if (response) {
        setCurrentStackID(response.data._id);
        setCurrentStack(response.data.stack);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage(error.data);
    }
  };

  const newValue = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/rpn/stack/" + currentStackID, {
        value: number,
      });
      if (response) {
        console.log(response.data.stack);
        setCurrentStackID(response.data._id);
        setCurrentStack(response.data.stack);
        setNumber("");
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("Error: Wrong Input");
    }
  };
  const calculate = async (e, operator) => {
    e.preventDefault();
    try {
      const response = await axios.post("/rpn/op/stack/" + currentStackID, {
        operator: operator,
      });
      if (response) {
        setCurrentStackID(response.data._id);
        setCurrentStack(response.data.stack);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage(error.data);
    }
  };

  const deleteStack = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete("rpn/stack/" + currentStackID);
      setListStacks(response.data);
      selectStack(response.data[0]._id);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.data);
    }
  };

  useEffect(async () => {
    const response = await axios.get("/rpn/stack");
    setListStacks(response.data);
    selectStack(currentStackID);
  }, [currentStackID]);

  useEffect(async () => {
    try {
      const response = await axios.get("/rpn/stack");
      setListStacks(response.data);
      setCurrentStack(response.data[0].stack);
      setCurrentStackID(parseInt(response.data[0]._id));
    } catch (error) {
      setErrorMessage(error.data);
    }
  }, []);

  return (
    <div className={styles.main__mainContainer}>
      <p className={classes.main__errorArea}>{errorMessage}</p>

      <h1>RPN Calculator</h1>
      <div className={styles.main__calculatorContainer}>
        <input
          className={classes.inputArea}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="0.00"
        />
        <Button className={classes.inputButton} onClick={(e) => newValue(e)}>
          ENTER
        </Button>
        <Button
          className={classes.operatorButton}
          style={{ gridColumn: "1 / 2", gridRow: "3/4", fontSize: 64 }}
          onClick={(e) => calculate(e, "+")}
        >
          +
        </Button>
        <Button
          className={classes.operatorButton}
          style={{
            gridColumn: "2 / 3",
            gridRow: "3/4",
            fontSize: 64,
          }}
          onClick={(e) => calculate(e, "-")}
        >
          -
        </Button>
        <Button
          className={classes.operatorButton}
          style={{ gridColumn: "1 / 2", gridRow: "4/5" }}
          onClick={(e) => calculate(e, "*")}
        >
          x
        </Button>
        <Button
          className={classes.operatorButton}
          onClick={(e) => calculate(e, "/")}
        >
          /
        </Button>
        <div className={styles.main__stackSelector}>
          <h2 className={classes.label}>STACK</h2>
          <select
            name="Stack Id"
            value={currentStackID}
            className={classes.stackSelector}
            onChange={(e) => selectStack(e.target.value)}
          >
            {listStacks?.map((stack) => (
              <option key={stack._id} value={stack._id}>
                {stack._id}
              </option>
            ))}
          </select>
          <div className={styles.main__stackButtons}>
            <Button
              className={classes.newStackButton}
              onClick={(e) => newStack(e)}
            >
              <AddIcon className={classes.newStackIcon} />
            </Button>
            <Button
              className={classes.deleteStackButton}
              onClick={(e) => deleteStack(e)}
            >
              <DeleteIcon className={classes.deleteStackIcon} />
            </Button>
          </div>
        </div>
        <div className={styles.main__stackContainer}>
          <p className={classes.stackDisplay}>[{currentStack?.join(", ")}]</p>
        </div>
      </div>
    </div>
  );
}

export default Main;
