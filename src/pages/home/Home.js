import * as React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TalkingRobot from "../../components/talking-robot/TalkingRobot";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import Moment from "react-moment";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch, useSelector } from "react-redux";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

import { getListChat } from "../../redux/store/selectors/getListChat";
import { getMessageList } from "../../redux/store/selectors/getMessageList";
import { getCurrentChatID } from "../../redux/store/selectors/getCurrentChatID";

import "./Home.css";

import {
  GET_INCREMENT_CHAT_ID,
  SET_CHAT_ID_FIRST,
  ADD_CHAT_LIST,
  ADD_MESSAGE,
  REMOVE_CHAT,
  CLEAR_MESSAGE_LIST,
} from "../../redux/actionTypes";

const Home = () => {
  const messageList = useSelector(getMessageList());
  const listChat = useSelector(getListChat());
  const currentChatID = useSelector(getCurrentChatID());

  const dispatch = useDispatch();

  const [name, setName] = useState();
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(false);
  const [statusNewChat, setStatusNewChat] = useState(false);

  const elInputName = useRef(null);
  const elInputMessage = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    setValue,
    reset,
  } = useForm();

  const FormTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#7c5b70",
        border: "2px solid #7c5b70",
      },
      "&:hover fieldset": {
        borderColor: "#7c5b70",
      },
    },
  });

  const calcId = (type) => {
    let res;
    switch (type) {
      case "mess": {
        return messageList.length !== 0 ? messageList.length + 1 : 1;
      }
      default:
        break;
    }
    return res;
  };

  const createNewChat = () => {
    setStatusNewChat(true);
    setName("");
    setMessage("");
    dispatch({ type: GET_INCREMENT_CHAT_ID });
    elInputName.current.focus();
    reset();
  };

  const removeChat = (id) => {
    const dataFilter = listChat.filter((list) => list.id !== +id);
    dispatch({ type: REMOVE_CHAT, payload: dataFilter });
  };

  useEffect(() => {
    if (elInputName.current) {
      if (listChat.length > 0) {
        const dataFilter = listChat.filter(
          (list) => list.id === +currentChatID
        );
        if (dataFilter.length > 0) {
          setValue("nameUser", dataFilter[0].name);
          elInputMessage.current.focus();
        }
      } else {
        elInputName.current.focus();
      }
    }
    // eslint-disable-next-line
  }, [currentChatID]);

  useEffect(() => {
    if (name?.trim() !== "" && message?.trim() !== "") {
      if (listChat.length === 0 && currentChatID === 1) {
        dispatch({
          type: ADD_CHAT_LIST,
          payload: {
            id: currentChatID,
            name: name,
            date: new Date(),
          },
        });
      }

      if (statusNewChat) {
        dispatch({
          type: ADD_CHAT_LIST,
          payload: {
            id: currentChatID,
            name: name,
            date: new Date(),
          },
        });
        setStatusNewChat(false);
      }

      dispatch({
        type: ADD_MESSAGE,
        payload: {
          id: calcId("mess"),
          author: name,
          text: message,
          chatId: currentChatID,
        },
        calcId,
        setProgress,
      });
    }

    // eslint-disable-next-line
  }, [name, message]);

  useEffect(() => {
    if (listChat.length === 0 && messageList.length > 0) {
      dispatch({ type: CLEAR_MESSAGE_LIST });
      dispatch({ type: SET_CHAT_ID_FIRST });
      resetField("textMessage");
      resetField("nameUser");
    }
    // eslint-disable-next-line
  }, [listChat, messageList]);

  const onSubmit = (data) => {
    setProgress(true);
    setName(data.nameUser);
    setMessage(data.textMessage);
    resetField("textMessage");
  };

  return (
    <div className="main">
      <Container className="main-container" maxWidth="sm">
        <List
          className="chat-list"
          sx={{
            width: "100%",
            maxWidth: 360,
            minWidth: 250,
            bgcolor: "background.paper",
          }}
        >
          {listChat && listChat?.length > 0 ? (
            listChat.map((chat) => (
              <div className="chat-wrap" key={chat.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={chat.name} src="../../image/robot.gif" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.name}
                    secondary={
                      <React.Fragment>
                        <Moment format="DD.MM.YYYY HH:mm">{chat.date}</Moment>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <div onClick={() => removeChat(chat.id)} className="btn-remove">
                  +
                </div>
                <div className="wrap-icons">
                  <Link className="link" to={"chat/" + chat.id}>
                    <ArticleIcon className="icon-open" />
                  </Link>
                  <Link className="link" to={"user-profile/"}>
                    <PersonIcon className="icon-user" />
                  </Link>
                </div>

                <Divider variant="inset" component="li" />
              </div>
            ))
          ) : (
            <div className="no-chat">No chat</div>
          )}
        </List>
        <Box
          className="box"
          sx={{
            bgcolor: "#fef6e4",
          }}
        >
          <h2 className="text">Ask the robot Max something:</h2>
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <FormTextField
              inputRef={elInputName}
              className="input"
              label="Type your name"
              id="custom-css-outlined-input"
              name="nameUser"
              fullWidth
              {...register("nameUser", {
                required: "Name is required.",
              })}
              error={Boolean(errors.nameUser)}
              helperText={errors.nameUser?.message}
            />

            <FormTextField
              inputRef={elInputMessage}
              label="Type your message"
              id="custom-css-outlined-input"
              name="textMessage"
              className="input"
              fullWidth
              {...register("textMessage", {
                required: "Message is required.",
              })}
              error={Boolean(errors.textMessage)}
              helperText={errors.textMessage?.message}
            />

            <div className="group_btn">
              <button type="submit" className="btn btn-submit">
                SEND
              </button>
              <button
                onClick={createNewChat}
                type="button"
                className="btn btn-newchat"
              >
                NEW CHAT
              </button>
            </div>
          </form>
          <button type="button" className="btn btn-cats">
            <Link className="link" to={"cats/"}>
              <span className="text-btn">Click on this button to see cats</span>
              <SentimentVerySatisfiedIcon className="icon-smile" />
            </Link>
          </button>
          <TalkingRobot
            chat={messageList}
            progress={progress}
            currentChatID={currentChatID}
          />
        </Box>
      </Container>
    </div>
  );
};

export default Home;
