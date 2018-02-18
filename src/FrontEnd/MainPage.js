import React ,{Component} from 'react';
import {
  View,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  FlatList,
  Modal,
  Alert,
  CheckBox,
  TouchableOpacity,
} from 'react-native';
import styles from './style';
import fireBase, {database} from '../BackEnd/firebase';
import {fireBaseClassNode} from './Classes';
import {Feather} from '@expo/vector-icons';
import {
  Container,
  Content,
  Text,
  Left,
  Body,
  Right,
  Button,
  Fab,
  CardItem,
  Card,
  Root,
} from 'native-base';
import StudentModal from './resources/studentmodal';
import BottomFab from './resources/bottomfab';
import PalButtons from './resources/palbuttons';
import {connect} from 'react-redux';

var numberOfStudents = null;
//present absent component
class MainPage extends Component {
    constructor(props){
    super(props);
    this.state = {
      students_array: [],
      numberOfStudents:null,
      loading: true,
      refreshing:false,
      StudentModalView:false,
    };
   this._renderItem = this._renderItem.bind(this);
   this.listenForItems = this.listenForItems.bind(this);
   this._resetFlatlist = this._resetFlatlist.bind(this);
   this._handleRefresh = this._handleRefresh.bind(this);
  }
//give students reference to the funtion
componentDidMount() {
  let studentReference = database.ref(`user_classes/xuKDcv8itdPnUGhLHjvaWfVEptm2/class_list/${this.props.classID}/studet_list`);
  this.setState({
    loading:true,
  },
  ()=>this.listenForItems(studentReference));
}

// Fetch Students referance
listenForItems(studentReference) {
  studentReference.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          user_id: child.key,
          name: child.val().name,
          last_name: child.val().last_name,
        });
      });
      // console.log(items);
      numberOfStudents = items.length;
      this.setState({
        students_array: items ,
        numberOfStudents: items.length,
        loading:false,
        refreshing:false,
      });
    });
};

_renderItem({item}){
  return(
    <CardItem style={styles.transparentBorderColor}>
        <Body
          style={styles.MainPageBodyStyle}>
          <View style={styles.MainPageViewStyle}>
            <Text>{item.name} {item.last_name}</Text>
          </View>
         <Body>
              <PalButtons
               userID = {item.user_id}
               userName = {item.name}
               userSurName = {item.last_name}
             />
          </Body>
        </Body>
    </CardItem>
  );
};

_renderFooter = () => {
  if(!this.state.loading) return null;
  return(
    <View>
      <ActivityIndicator animating color={"#0f6abc"} size={"small"}/>
    </View>
  );
};

_resetFlatlist(){
  this.setState({
    students_array: [] ,
    numberOfStudents: null,
    loading:true,
    refreshing:false,
    StudentModalView:false,
  });
  setTimeout(()=>this.listenForItems(this.itemsRef),1);
};

_handleRefresh(){
  this.setState({
    refreshing:true,
  },
  ()=>{
    this.listenForItems(this.itemsRef);
  });
}

  render() {
    console.log("id: "+JSON.stringify(this.props.classID));
    return (
      <Container style={styles.BackgroundColor}>
        <Content>
          {this.state.students_array.length <= 0  ?
              <View style={styles.deviceHalf}>
                <Text
                  onPress={() => this.setState({StudentModalView: true})}
                  style={{color:"#0f6abc",fontSize:18}}>
                  Add student
                </Text>
              </View>
              :
              <Card>
                <FlatList
                    style={styles.flatListStyle}
                    data = {this.state.students_array}
                    renderItem = {this._renderItem}
                    keyExtractor={item => item.user_id}
                    ListFooterComponent={this._renderFooter}
                    refreshing = {this.state.refreshing}
                    onRefresh = {()=>this._handleRefresh()}
                    />
              </Card>
            }
      </Content>
      <BottomFab StudentModalView={this.state.StudentModalView} numberOfStudents={numberOfStudents} resetFlatlist={this._resetFlatlist} />
    </Container>
    );
  }
}

export default connect((store)=>{
  return{
    classID: store.class.classID
  }
})(MainPage);
