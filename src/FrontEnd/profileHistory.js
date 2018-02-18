import React,{Component} from 'react';
import {
  View,
  Button,
  FlatList,
} from 'react-native';
import {
  Text,
  Thumbnail,
  Container,
  Content,
  Body,
  Left,
  Right,
  SwipeRow,
  Card,
  CardItem,
} from 'native-base';
import styles from './style';
import fireBase,{database,auth} from '../BackEnd/firebase';
import {userHistoryItem} from './History';
import {EvilIcons} from '@expo/vector-icons';
import {connect} from 'react-redux';

class DetailRow extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <Body>
        <Body
          style={styles.rowOne}>
          <Left style={styles.presentBox}>
            <Text style={styles.whiteColor}>Present</Text>
          </Left>
          <Body style={styles.absentBox}>
            <Text style={styles.whiteColor}>Absent</Text>
          </Body>
          <Right style={styles.lateBox}>
            <Text style={styles.whiteColor}>Late</Text>
          </Right>
        </Body>
        <Body style={styles.rowTwo}>
          <Left style={styles.box}>
            <Text style={styles.presentColor}>
                {this.props.present}
              </Text>
          </Left>
          <Body style={styles.box}>
            <Text style={styles.absentColor}>
                {this.props.absent}
            </Text>
          </Body>
          <Right style={styles.box}>
            <Text style={styles.lateColor}>
                {this.props.late}
            </Text>
          </Right>
        </Body>
      </Body>
    );
  }
};

class ProfileHistory extends Component{
  constructor(props){
    super(props);
    this.state={
      showTab:false,
      presentNumber:0,
      absentNumber:0,
      lateNumber:0,
      historyArray:[],
    };
    this._showFullHistory = this._showFullHistory.bind(this);
    this._listenForItem = this._listenForItem.bind(this);
    this._renderHistory = this._renderHistory.bind(this);
    this._checkForStatus = this._checkForStatus.bind(this);
  }

componentDidMount(){
  this._listenForItem();
  this._checkForStatus();
}

_checkForStatus(){
  let currentUserUid = auth.currentUser.uid;
  let totalItemsRef = database.ref(`Registery/${currentUserUid}/${this.props.classID}/${userHistoryItem.user_id}/Total/`);
  totalItemsRef.on('value',(snap)=>{
    snap.forEach(()=>{
      if (snap.val().total_present) {
        let newValue = snap.val().total_present;
        this.setState(()=>({
          presentNumber:newValue,
        }));
      }
      if(snap.val().total_absent) {
        let newValue = snap.val().total_absent;
        this.setState(()=>({
          absentNumber:newValue,
        }));
      }
      if(snap.val().total_late) {
        let newValue = snap.val().total_late;
        this.setState(()=>({
          lateNumber:newValue,
        }));
      }
    });
  });
}

_listenForItem(){
  let currentUserUid = auth.currentUser.uid;
  let itemsRef = database.ref(`Registery/${currentUserUid}/${this.props.classID}/${userHistoryItem.user_id}/Date/`);
  itemsRef.on('value', (snap)=>{
    var items = [];
    snap.forEach((child)=>{
      items.push({
        date: child.key,
        user_id: child.val().status.user_id,
        user_lastName: child.val().status.user_lastName,
        user_name: child.val().status.user_name,
        user_status: child.val().status.user_status,
        Comment: child.val().status.Comment,
        Mark: child.val().status.Mark,
      });
    });
    console.log(items);
    this.setState({
      historyArray: items,
    });
  });
}


_renderHistory({item}){
  console.log(item);
  return(
    <CardItem
      style={styles.transparentBorderColor}>
        <Body
          style={styles.ProfileHistoryStyle}>
          <Body
            style={styles.center}>
              <Text>{item.date}</Text>
          </Body>
          <View style={{flex:1,flexDirection:"column",alignItems:"flex-start",justifyContent:"flex-start"}}>
              <Text style={{padding:5}}>Status: {item.user_status}</Text>
              <Text style={{padding:5}}>Mark: {item.Mark}</Text>
              <Text style={{padding:5}}>Comment: {item.Comment}</Text>
          </View>
        </Body>
    </CardItem>
  );
}

_showFullHistory(itemsRef){
  return(
        <Card>
          <FlatList
            style={styles.flatListStyle}
            data={this.state.historyArray}
            renderItem={this._renderHistory}
            keyExtractor={item => `item${item.user_id}`}
          />
        </Card>
  );
}

render(){
    return(
      <Container style={styles.BackgroundColor}>
        <Content>
          <Body>
            <EvilIcons name={"user"} size={120} color={"#0f6abc"}/>
            <Text>{userHistoryItem.name} {userHistoryItem.last_name}</Text>
          </Body>
          <DetailRow
            present={this.state.presentNumber}
            absent={this.state.absentNumber}
            late={this.state.lateNumber}/>
          <Body
            style={{marginTop:20}}>
            <Text
              style={{color:"#0f6abc"}}
              onPress={()=>this.setState({showTab:!this.state.showTab})}>
               show history
             </Text>
            {this.state.showTab? this._showFullHistory() : null}
          </Body>
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
})(ProfileHistory);
