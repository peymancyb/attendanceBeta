import React ,{Component,PureComponent} from 'react';
import {
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  CheckBox } from 'react-native';
import styles from '../style';
import fireBase,{database,auth} from '../../BackEnd/firebase';
import {Entypo,Feather,MaterialIcons,EvilIcons} from '@expo/vector-icons';
import {fireBaseClassNode} from '../Classes';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Left,
  Body,
  Right,
  Icon,
  Card,
  CardItem,
  Footer,
  FooterTab,
  Button,
  Tab,
  Tabs,
  TabHeading,
  Segment,
  Fab,
  Toast,
  SwipeRow,
} from 'native-base';
import {connect} from 'react-redux';
import {studentAction} from '../../redux/actions/studentAction';

export var tempArr = [];


let date = new Date();
let dateString = `${date.getFullYear() +"-"+(date.getMonth() + 1)+"-"+ date.getDate()}`;
let currentDate = dateString.toString();

class PalButtons extends Component{
  constructor(props){
    super(props);
    //setting default state
    this.defaultState = {
        presentStatus: true,
        absentStatus: true,
        lateStatus: true,
        status: null,
        buttonStatus:false,
        student_palStatus:[],
       };
    this.state = this.defaultState;
    this._presentButton = this._presentButton.bind(this);
    this._absentButton = this._absentButton.bind(this);
    this._lateButton = this._lateButton.bind(this);
    this._storeData = this._storeData.bind(this);
}

_storeData(currentData){
  this.props.dispatch(studentAction(currentData));
}

_presentButton(props){
  this.setState({
    presentStatus: this.state.presentStatus ? false : true,
    absentStatus:true,
    lateStatus:true,
    buttonStatus:true,
    status: (this.state.status == null || this.state.status == "Absent" || this.state.status == "Late" ) ? "Present" : null,
  });
  //data's object
  let itemObj = {
    user_id:props.userID,
    user_name:props.userName,
    user_lastName:props.userSurName,
    user_status:"Present",
    current_date: currentDate,
  };
  //calling _storeData function
  if(this.state.presentStatus == true){
    this._storeData(itemObj);
  }
}

_absentButton(props){
  this.setState({
    absentStatus: this.state.absentStatus ? false : true,
    lateStatus:true,
    presentStatus:true,
    buttonStatus:true,
    status: (this.state.status == null || this.state.status == "Late" || this.state.status == "Present") ? "Absent" : null,
  });
  //data's object
  let itemObj ={
    user_id:props.userID,
    user_name:props.userName,
    user_lastName:props.userSurName,
    user_status:"Absent",
    current_date: currentDate,
  };
  //calling _storeData function
  if(this.state.absentStatus == true){
    this._storeData(itemObj);
  }
}
_lateButton(props){
  this.setState({
    lateStatus: this.state.lateStatus ? false : true,
    absentStatus:true,
    presentStatus:true,
    buttonStatus:true,
    status: (this.state.status == null || this.state.status == "Absent" || this.state.status == "Present") ? "Late" : null,
  });
  //data's object
  let itemObj ={
    user_id:props.userID,
    user_name:props.userName,
    user_lastName:props.userSurName,
    user_status:"Late",
    current_date: currentDate,
  };
  //calling _storeData function
  if(this.state.lateStatus == true){
    this._storeData(itemObj);
  }
}
render(){
    return(
          <View style={{flexDirection:"row",borderColor:"#0f6abc",borderBottomWidth:0.6}}>
              <TouchableHighlight
                disabled={this.state.buttonStatus}
                style={this.state.presentStatus ? styles.defaultButton : styles.presentIsChecked}
                onPress={()=>this._presentButton(this.props)}
                >
                <Text style={this.state.presentStatus ? styles.colorOffStatus : styles.colorOnStatus}>Present</Text>
              </TouchableHighlight>
              <TouchableHighlight
                disabled={this.state.buttonStatus}
                style={this.state.absentStatus ? styles.defaultButton : styles.absentIsChecked}
                onPress={()=>this._absentButton(this.props)}
                >
                <Text style={this.state.absentStatus ? styles.colorOffStatus : styles.colorOnStatus}>Absent</Text>
              </TouchableHighlight>
              <TouchableHighlight
                disabled={this.state.buttonStatus}
                style={this.state.lateStatus ? styles.defaultButton : styles.lateIsChecked}
                onPress={()=>this._lateButton(this.props)}
                >
                <Text style={this.state.lateStatus ? styles.colorOffStatus : styles.colorOnStatus}>Late</Text>
              </TouchableHighlight>
          </View>
    );
  }
}


export default connect((store)=>{
  return{
    classID: store.class.classID,
    students: store.students
  }
})(PalButtons);
