import React ,{Component} from 'react';
import {Text,View,TextInput, TouchableOpacity,FlatList,KeyboardAvoidingView } from 'react-native';
import styles from './style';
import fireBase,{database,auth} from '../BackEnd/firebase';
import {StackNavigator , TabNavigator} from 'react-navigation';
import {MaterialCommunityIcons,EvilIcons,FontAwesome} from '@expo/vector-icons';
import { Hoshi } from 'react-native-textinput-effects';
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
import {fireBaseClassNode} from './Classes';
import {connect} from 'react-redux';


let date = new Date();
let dateString = `${date.getFullYear() +"-"+(date.getMonth() + 1)+"-"+ date.getDate()}`;
let currentDate = dateString.toString();

class Comments extends Component {
  constructor(props){
    super(props);
    this.state = {
      students_array: [],
      Comment:'',
    };
    this._renderItem = this._renderItem.bind(this);
    this.listenForItems = this.listenForItems.bind(this);
    this._sendComment = this._sendComment.bind(this);

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
  _sendComment(item){
    let currentUserUid = auth.currentUser.uid;
    let RegisteryCommentRef = database.ref(`Registery/${currentUserUid}/${this.props.classID}/${item.user_id}/Date/${currentDate}/status`);
    if(this.state.Comment === null || this.state.Comment === ''){
      Toast.show({
       text:"Please write Comment!",
       position:"bottom",
       type:"warning"
     });
   }else{
     Toast.show({
       text:"Comment has been set!",
       position:"bottom",
       type:"success"
     });
     RegisteryCommentRef.update({
         Comment: this.state.Comment
       });
     this.setState({
       Comment:null,
     });
   }
  };
  _renderItem({item}){
      return(
        <KeyboardAvoidingView keyboardVerticalOffset={0} behavior={"padding"}>
          <CardItem style={styles.MarkCardItemStyle}>
              <Body
                style={[styles.CommentsBody,{flexDirection:"row"}]}>
                   <Hoshi
                      clearTextOnFocus={true}
                      style={styles.HoshiStyle}
                      label={`${item.name+" "+item.last_name+" :"}`}
                      labelStyle={{ color: '#0f6abc' }}
                      borderColor={'#5067FF'}
                      inputStyle={{ color: '#0f6abc' }}
                      onChangeText = {(Comment)=>this.setState({Comment: Comment})}
                    />

                   <TouchableOpacity
                      style={styles.commentStyleInput}
                      onPress={() => this._sendComment(item)}>
                     <EvilIcons name="comment" size={32} color={"white"} />
                   </TouchableOpacity>
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
                     keyExtractor={item => item.name}
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
})(Comments);
