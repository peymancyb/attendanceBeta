import React ,{Component} from 'react';
import {
   Text,
   View,
   TextInput,
   TouchableOpacity,
   FlatList,
   Modal,
   Button,
   ActivityIndicator} from 'react-native';
import styles from './style';
import fireBase,{database} from '../BackEnd/firebase';
import {
  Container,
  Content,
  Body,
  Toast,
  Fab,
  Card,
  CardItem,
  Left,
  Right,
  List,
  ListItem,
  Footer,
  FooterTab,
  Root,
} from 'native-base';
import {Entypo,MaterialIcons} from '@expo/vector-icons';

export default class ClassModal extends Component{
  constructor(props){
    super(props);
    this.state={
      name: '',
      descreption: '',
      modalVisible: props.modalView,
    };
    this._saveClassData = this._saveClassData.bind(this);
  }

  _saveClassData(){
    let classReference = database.ref('user_classes/xuKDcv8itdPnUGhLHjvaWfVEptm2/class_list/');
    if(this.state.name != ''&& this.state.descreption != ''){
      classReference.push({class_name:this.state.name , descreption: this.state.descreption});
      Toast.show({
        text:"Class has been added",
        position:"bottom",
        type:"success"
      });
      this.setState({name: '',descreption:'', modalVisible: false});
    }else{
      Toast.show({
        text:"Data is missing!",
        position:"bottom",
        type:"warning"
      });
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      modalVisible: nextProps.modalView
    });
  }
  render(){
    return(
          <Modal
            animationType="none"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={()=>this.setState({modalVisible: false})}
            >
          <Body style={styles.inputcontainerModal}>
            <View style={{backgroundColor:"#0f6abc",alignItems:"center",justifyContent:"center",width:"100%",}}>
            <TextInput
              style={styles.inputStyleModal}
              autoCapitalize={'none'}
              autoCorrect={false}
              onChangeText={(Name) => this.setState({name: Name})}
              value={this.state.name}
              clearTextOnFocus={true}
              placeholder="Class Name"
              placeholderTextColor={"white"}
              underlineColorAndroid={'transparent'}
            />
            <TextInput
              style={styles.inputStyleModal}
              onChangeText={(Descreption) => this.setState({descreption: Descreption})}
              value={this.state.descreption}
              clearTextOnFocus={true}
              placeholder="Descreption"
              placeholderTextColor={"white"}
              underlineColorAndroid={'transparent'}
            />
            <View style={styles.marginTopButton}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.modalAddStudent}
                onPress={()=>this._saveClassData()}
                >
                <Text style={styles.addStudentStyleModal}>Add Class</Text>
               </TouchableOpacity>
               <TouchableOpacity
                 activeOpacity={0.8}
                 style={styles.modalAddStudent}
                 onPress={()=>this.props.handleState(false)}
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
