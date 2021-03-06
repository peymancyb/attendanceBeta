import React ,{Component} from 'react';
import {
  Text,
  Alert,
  TouchableOpacity,
  View,
  TextInput,
  TouchableHighligh,
  FlatList,
  KeyboardAvoidingView} from 'react-native';
import styles from './style';
import fireBase,{database,auth} from '../BackEnd/firebase';
import {MaterialCommunityIcons,SimpleLineIcons} from '@expo/vector-icons';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
  Card,
  CardItem,
  Footer,
  FooterTab,
  Button,
  SwipeRow,
  Toast,
  Root,
} from 'native-base';
import {connect} from 'react-redux';

let date = new Date();
let dateString = `${date.getFullYear() +"-"+(date.getMonth() + 1)+"-"+ date.getDate()}`;
let currentDate = dateString.toString();

class Marks extends Component {
  constructor(props){
    super(props);
    this.state = {
      students_array: [],
      Mark:null,
    };
    this._renderItem = this._renderItem.bind(this);
    this.listenForItems = this.listenForItems.bind(this);
    this._sendMark = this._sendMark.bind(this);
  }

  componentDidMount() {
    let currentUserUid = auth.currentUser.uid;
    let studentReference = database.ref(`user_classes/${currentUserUid}/class_list/${this.props.classID}/studet_list`);
    this.listenForItems(studentReference);
  }
  // Fetch Students referance
  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          user_id: child.key,
          name: child.val().name,
          last_name: child.val().last_name,
        });
      });
      this.setState({students_array: items });
    });
  }
_chandeText(mark){
this.setState({Mark: mark});
}
_sendMark(item){
  let currentUserUid = auth.currentUser.uid;
  let RegisteryMarkRef = database.ref(`Registery/${currentUserUid}/${this.props.classID}/${item.user_id}/Date/${currentDate}/status`);
  if(this.state.Mark === null || this.state.Mark === ''){
    Toast.show({
      text:"Please enter mark!",
      position:"bottom",
      type:"warning",
    });
 }else{
   Toast.show({
     text:"Mark has been set!",
     position:"bottom",
     type:"success",
   });
   RegisteryMarkRef.update({
       Mark: this.state.Mark
     });
   this.setState({
     Mark:null,
   });
 }
};
  _renderItem({item}){
      return(
        <KeyboardAvoidingView keyboardVerticalOffset={0} behavior={"padding"}>
          <CardItem style={styles.MarkCardItemStyle}>
            <Body style={styles.MarkBodyItemStyle}>
              <SwipeRow
                style={styles.MarkSwipeRow}
                 disableLeftSwipe={true}
                 leftOpenValue={75}
                 left={
                   <Button
                      success
                      onPress={() => this._sendMark(item)}>
                     <SimpleLineIcons name="check" size={22} color={"white"} />
                   </Button>
                 }
                 body={
                   <View style={[this.MarkItemView,{flexDirection:"row"}]}>
                     <Body>
                       <View style={styles.MarkViewStyle}>
                         <Text>{item.name} {item.last_name}</Text>
                       </View>
                     </Body>
                     <Right>
                         <TextInput
                           clearTextOnFocus={true}
                           autoCorrect={false}
                           editable = {true}
                           onChangeText = {(mark)=>this._chandeText(mark)}
                           underlineColorAndroid={"transparent"}
                           placeholder={"Mark"}
                           style={styles.MarkTextInputStyle}/>
                   </Right>
                 </View>
               }
             />
          </Body>
        </CardItem>
      </KeyboardAvoidingView>
      );
    }

  render() {
    return (
      <Container style={styles.BackgroundColor}>
       <Content>
         <KeyboardAvoidingView keyboardVerticalOffset={0} behavior={"padding"}>
           {
             this.state.students_array <= 0 ?
             <View style={styles.deviceHalf}>
               <Text
                 onPress={() => this.props.navigation.navigate("Registery")}
                 style={{color:"#0f6abc",fontSize:18}}>
                 no student found!
               </Text>
             </View>
             :
             <Card>
                 <FlatList
                   style={styles.flatListStyle}
                   data = {this.state.students_array}
                   renderItem = {this._renderItem}
                   keyExtractor={item => item.user_id}
                 />
             </Card>
           }
         </KeyboardAvoidingView>
       </Content>
     </Container>
    );
  }
}

export default connect((store)=>{
  return{
    classID: store.class.classID,
    students: store.students
  }
})(Marks);
