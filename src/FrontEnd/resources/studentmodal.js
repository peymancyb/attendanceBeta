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


let date = new Date();
let dateString = `${date.getFullYear() +"-"+(date.getMonth() + 1)+"-"+ date.getDate()}`;
let currentDate = dateString.toString();


class StudentModal extends Component{
  constructor(props){
    super(props);
    this.defaultState={
        name: '',
        last_name: '',
        modalView: props.modalView,
    };
    this.state = this.defaultState;
    this._saveData = this._saveData.bind(this);
    this._passState = this._passState.bind(this);
  }

  _passState(){
    this.props.handleState(false);
    this.setState({
      modalView: false,
    });
  }

  _saveData(){
    let currentUserUid = auth.currentUser.uid;
    let studentRef = database.ref(`user_classes/${currentUserUid}/class_list/${this.props.classID}/studet_list`);
    if(this.state.name != '' && this.state.last_name != ''){
      studentRef.push({ name: this.state.name, last_name: this.state.last_name});
      let student_name = this.state.name +" "+this.state.last_name;
      let replaceSpecialCharactors = student_name.toString();
      let new_student = replaceSpecialCharactors.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
      //have all application students in one place
      database.ref('all_students/'+new_student).set({
        name: new_student
      });
      Toast.show({
              text: 'Student saved successfully!',
              position: 'bottom',
              type:"success",
        });
      this.setState({name: '',last_name:'', modalVisible: false});
    }else{
      Toast.show({
              text: 'please insert student information!',
              position: 'bottom',
              type:"warning",
        });
    }
  }


  componentWillReceiveProps(nextProps){
    this.setState({
      modalView: nextProps.modalView
    });
  }


  render(){
    return(
          <Modal
              animationType="none"
              transparent={true}
              visible={this.state.modalView}
              onRequestClose={()=>this.setState({modalVisible: false})}
            >
            <Body style={styles.inputcontainerModal}>
              <View style={{backgroundColor:"#0f6abc",alignItems:"center",justifyContent:"center",width:"100%",}}>
              <TextInput
                style = {styles.inputStyleModal}
                onChangeText={(Name) => this.setState({name: Name})}
                value={this.state.name}
                placeholder="Name"
                placeholderTextColor={"white"}
                clearTextOnFocus={true}
                underlineColorAndroid={'transparent'}
                />
              <TextInput
                style = {styles.inputStyleModal}
                onChangeText={(lastName) => this.setState({last_name: lastName})}
                value={this.state.last_name}
                placeholder="Surname"
                placeholderTextColor={"white"}
                clearTextOnFocus={true}
                underlineColorAndroid={'transparent'}
                />

                <View style={styles.marginTopButton}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.modalAddStudent}
                  onPress={()=>this._saveData()}
                  >
                      <Text style={styles.addStudentStyleModal}>Add Student</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   activeOpacity={1}
                   style={styles.modalAddStudent}
                   onPress={()=>this._passState()}
                   >
                       <Text style={styles.addStudentStyleModal}>Cancel</Text>
                  </TouchableOpacity>
                  </View>
                </View>
               </Body>
           </Modal>
    );
  }
}

export default connect((store)=>{
  return{
    classID: store.class.classID
  }
})(StudentModal);
