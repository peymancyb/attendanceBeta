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
import ClassModal from './classModal';
import fireBase,{database,auth} from '../BackEnd/firebase';
import {connect} from 'react-redux';
import {classID} from '../redux/actions/classAction';


class ListClasses extends Component {
  constructor(props){
    super(props);
    this.state = {
      ClassModalView:false,
      Class_array: [],
      loading:false,
      refreshing: false,
      loadingIndicator:false,
    };
   this._renderClassItem = this._renderClassItem.bind(this);
   this.listenForClassItems = this.listenForClassItems.bind(this);
   this._navigateToStudent = this._navigateToStudent.bind(this);
   this._handleModalState = this._handleModalState.bind(this);
   this._renderFooter = this._renderFooter.bind(this);
  }

  componentDidMount() {
    let currentUserUid = auth.currentUser.uid;
    let classReference = database.ref(`user_classes/${currentUserUid}/class_list/`);
    this.setState({
      loading: true,
      refreshing:true,
    },()=>this.listenForClassItems(classReference));
  }

  listenForClassItems(classReference) {
    classReference.on('value', (snap) => {
      var items = [];
      snap.forEach((child) => {
        items.push({
          class_id: child.key,
          name: child.val().class_name,
          descreption: child.val().descreption
        });
      });
      this.setState({
        Class_array: items,
        loading: false,
        refreshing:false,
      });
    });
  }

  //=========================================================
  _navigateToStudent(item){
      let id = item.class_id;
      this.props.dispatch(classID(id));
      this.props.dispatch({type:"RESET"});
      this.setState({
        loadingIndicator:true
      },()=>{
      this.props.navigation.navigate("HomePage");
      this.setState({
        loadingIndicator:false,
        ClassModalView:false,
        loading:false,
        refreshing: false,
      });
    });
  }

  _renderClassItem({item}){
      return(
        <TouchableOpacity onPress={()=>this._navigateToStudent(item)} activeOpacity={0.8}>
          <CardItem style={styles.cardItemStyle}>
              <View
                style={styles.flexDirectionRow}>
                <Left style={styles.ClassLeftItemStyle}>
                  <Text>Class name: {item.name}</Text>
                  <Text style={styles.ClassLeftStyleText}>Descreption: {item.descreption}</Text>
                </Left>
                <Right>
                  <MaterialIcons name={"arrow-forward"} size={22} color={"#0f6abc"}/>
                  <ActivityIndicator animating={this.state.loadingIndicator} color={"#0f6abc"} size={"small"} hidesWhenStopped={!this.state.loadingIndicator} />
                </Right>
              </View>
          </CardItem>
        </TouchableOpacity>
    );
  }
    _handleModalState(modalState){
      this.setState({
        ClassModalView: modalState,
      });
    }

    _renderFooter(){
      if(!this.state.loading) return null;
      return(
        <View>
          <ActivityIndicator animating={this.state.loading} color={"#0f6abc"} size={"large"} hidesWhenStopped={!this.state.loading} />
        </View>
      );
    };

    _handleRefresh(){
      let currentUserUid = auth.currentUser.uid;
      let classReference = database.ref(`user_classes/${currentUserUid}/class_list/`);
      this.setState({
        refreshing:true,
      },
      ()=>{
        this.listenForClassItems(classReference);
      });
    }
  //=========================================================
  render() {
    return (
      <Container style={styles.BackgroundColor}>
        <Content>
            <Body>
              <ClassModal modalView={this.state.ClassModalView} handleState={this._handleModalState}/>
            </Body>
            <Card>
              <FlatList
                style={styles.flatListStyle}
                data = {this.state.Class_array}
                renderItem = {this._renderClassItem}
                keyExtractor={item => item.class_id}
                ListFooterComponent={this._renderFooter}
                refreshing={this.state.refreshing}
                onRefresh={()=>this._handleRefresh()}
              />
            </Card>
          </Content>
        <View style={styles.flexOne}>
          <Fab
            style={styles.FabBackground}
            onPress={() => this.setState({ClassModalView: true})}>
            <Entypo name="add-to-list" color="white" size={35} />
          </Fab>
        </View>
      </Container>
    );
  }
}



export default connect((store)=>{
  return{
    classID: store.class,
    students: store.students
  }
})(ListClasses);
