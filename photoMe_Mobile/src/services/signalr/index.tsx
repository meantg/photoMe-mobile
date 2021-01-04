import * as signalR from "@microsoft/signalr";
import { Subject } from "@microsoft/signalr";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CONNECTION_STRING from "../../values/ConnectionString";
import MessageModel from "../../values/models/MessageModel";
import { useSelector, dispatch } from "react-redux";
import { RootState } from "../../services/redux/reducer";
import {Observable} from 'rxjs';

class ChatService {
  private connectionURL = CONNECTION_STRING.hubConnection;
  private connection: any;
  private userToken = '';
  public shareObj = new Subject<MessageModel>();
  private receiveMessageObject: MessageModel = {
    senderId: "",
    receiverId: "",
    content: "",
    type: "",
  };
  private user = useSelector((state: RootState) => state.user);
  /**
   *
   */
  constructor() {
    this.initChatHub();

    this.connection.on(
      "SendToSpecificUser",
      (senderId, receiverId, content) => this.mapReceiveMessage(senderId, receiverId, content)
    );
    this.connection.start().then(() => {
      console.log("connected");
    });
    console.log('abacsa');
    
  }
  connectChatHub = () => {
      this.initChatHub();
      this.connection.on(
        "SendToSpecificUser",
        (senderId, receiverId, content) => this.mapReceiveMessage(senderId, receiverId, content)
      );
      this.connection.start().then(() => {
        console.log("connected");
      });
      console.log('abacsa');
      
  }
  initChatHub = async () => {
    const token = await AsyncStorage.getItem("userToken");
    
    if (token !== null) {
        this.userToken = token;
        this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.connectionURL, {
          accessTokenFactory: () => token,
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();
    }
  };

  mapReceiveMessage = (senderId, receiverId, content) => {
    this.receiveMessageObject.senderId = senderId;
    this.receiveMessageObject.receiverId = receiverId;
    this.receiveMessageObject.content = content;
    console.log('receive');
    console.log('a');
    

    this.user.id === senderId ? this.receiveMessageObject.type = 'send' : this.receiveMessageObject.type = 'receive';

    this.shareObj.next(this.receiveMessageObject);
  };
}

const ChatSocketService = new ChatService();

export default ChatSocketService;
