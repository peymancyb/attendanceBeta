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
import StudentModal from './studentmodal';

let date = new Date();
let dateString = `${date.getFullYear() +"-"+(date.getMonth() + 1)+"-"+ date.getDate()}`;
let currentDate = dateString.toString();


class BottomFab extends Component{
  constructor(props){
    super(props);
    this.state={
      active: false,
      modalView:props.StudentModalView,
      checkStatus: true,
      numberOfStudents: props.numberOfStudents,
    };
    this._sendData = this._sendData.bind(this);
    this._sendToFirebase = this._sendToFirebase.bind(this);
    this._handleState = this._handleState.bind(this);
    this._resetItems = this._resetItems.bind(this);
    this.checkCondition = this.checkCondition.bind(this);
  }

_resetItems(props){
  this.props.dispatch({type:"RESET"});
  props.resetFlatlist();
}

_handleState(childCall){
    if(childCall == "undefined"){
      this.setState({
        modalView: !this.state.modalView
      });
    }else{
      this.setState({
        modalView: childCall
    });
  }
}

//make an array is the solution
_sendToFirebase(item){
  let currentUserUid = auth.currentUser.uid;
  let RegisteryDateRef = database.ref(`Registery/${currentUserUid}/${this.props.classID}/${item.user_id}/Date/${currentDate}`);
  let RegisteryTotalRef = database.ref(`Registery/${currentUserUid}/${this.props.classID}/${item.user_id}/Total/`);
//============================================================================
  RegisteryDateRef.set({
    status: item
  });
//==============================================================================
        if(item.user_status=="Present"){
          RegisteryTotalRef.once('value',(snap)=>{
            if (!snap.hasChild("total_present")) {
              return RegisteryTotalRef.update({
                    total_present: 1
                  });
            }else{
              snap = snap.val();
              let prev_val = snap.total_present;
              let update = prev_val+1;
              return RegisteryTotalRef.update({
                    total_present: update
                  });
                }
          });
        }
//==============================================================================
        if(item.user_status=="Absent"){
          RegisteryTotalRef.once('value',(snap)=>{
            if (!snap.hasChild("total_absent")) {
              return RegisteryTotalRef.update({
                    total_absent: 1
                  });
            }else{
              snap = snap.val();
              let prev_val = snap.total_absent;
              let update = prev_val+1;
              return RegisteryTotalRef.update({
                    total_absent: update
                  });
              }
          });
        }
        if(item.user_status=="Late"){
          RegisteryTotalRef.once('value',(snap)=>{
            if (!snap.hasChild("total_late")) {
              return RegisteryTotalRef.update({
                    total_late: 1
                  });
            }else{
              snap = snap.val();
              let prev_val = snap.total_late;
              let update = prev_val+1;
              return RegisteryTotalRef.update({
                    total_late: update
                  });

                }
          });
        }
    Toast.show({
            text: 'Data successfully added!',
            position: 'bottom',
            type: "success",
      });
      return this._resetItems(this.props);
  }





checkCondition(){
  console.log('add');
  let currentUserUid = auth.currentUser.uid;
  for (let i = 0; i < this.props.students.length; i++) {
    let itemsRef = database.ref(`Registery/${currentUserUid}/${this.props.classID}/${this.props.students[i].user_id}/Date/`).limitToLast(1);
    itemsRef.on('value', (snap)=>{
      snap.forEach((child) => {
        if(child.key === currentDate){
           Toast.show({
              text: "you have already submitted!",
              position: "bottom",
              type: "warning",
          });
        }else{
           this._sendToFirebase(this.props.students[i]);
        }
      });
    });
    console.log(date);

    }
}

_sendData(props){
  if (this.props.students.length != 0) {
      return this.checkCondition();
    }else{
      if(this.props.students.length == 0) {
        return Toast.show({
            text: "you did not select yet!",
            position: "bottom",
            type:"warning"
        });
      }else{
        return Toast.show({
            text: `${this.state.numberOfStudents - this.props.students.length} students left!`,
            position: "bottom",
            type:"warning"
        });
      }
    }
  }

componentWillReceiveProps(nextProps){
  this.setState({
    modalView: nextProps.StudentModalView,
    numberOfStudents: nextProps.numberOfStudents,
  });
}
  render(){
    return(
      <View>
          <Body>
            <StudentModal modalView={this.state.modalView} handleState={this._handleState}/>
          </Body>
        <Fab
          active={this.state.active}
          direction="up"
          style={{ backgroundColor: '#0f6abc' }}
          position="bottomRight"
          onPress={() => this.setState({ active: !this.state.active })}
          >
          <Entypo name="plus" color="white" size={22}/>
          <Button
            onPress={() => this._handleState()}
            style={{ backgroundColor: '#0f6abc' }}
            >
            <Entypo name="add-to-list" color="white" size={22}/>
          </Button>
          <Button
            style={{ backgroundColor: '#0f6abc' }}
            onPress={()=>this._sendData(this.props)}
            >
            <MaterialIcons name="check" color="white" size={22}/>
          </Button>
          <Button
            style={{ backgroundColor: '#0f6abc' }}
            onPress={()=>this._resetItems(this.props)}
            >
            <MaterialIcons name="refresh" color="white" size={22}/>
          </Button>
        </Fab>
      </View>
    );
  }
}

export default connect((store)=>{
  return{
    classID: store.class.classID,
    students: store.students
  }
})(BottomFab);
