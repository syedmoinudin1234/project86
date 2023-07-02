import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Switch
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as Font from "expo-font";

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      //initialise states
      name:"",
      light_theme:true,
      isEnabled:false,
    };

  }

 //write toggle switch function here
 toggleSwitch(){
  const previous_state = this.state.isEnabled;
  const theme = !this.state.isEnabled ? "dark" : "light"
  var updates ={}
  updates["/users/"+firebase.auth().currentUser.uid+"/current_theme"] = theme
  firebase.database().ref().update(updates)

  this.setState({isEnabled:!previous_state, light_theme : previous_state})

}

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }
//write fetch user function
 async fetchUser(){
  var name,theme
  await firebase.database()
  .ref("/users/"+firebase.auth().currentUser.uid)
  .on("value",(snapshot)=>{
    console.log(snapshot.val())
    theme=snapshot.val().current_theme
    name=snapshot.val().first_name

  })
  this.setState({
    name:name,
    light_theme:theme==="light"?true:false,
    isEnabled:theme==="light"?false:true,

  })
 }

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={styles.appTitleText}>Storytelling App</Text>
            </View>
          </View>
          <View style={styles.screenContainer}>
           {/*write your code here*/}
           <View style={styles.profileImageContainer}> 
           <Text style={styles.nameText}>{this.state.name} </Text>
           </View>
           <View style={styles.themeContainer}>
            <Text style={styles.themeText}> darktheme</Text>
            <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={this.state.isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={()=>this.toggleSwitch()}
        value={this.state.isEnabled}
      />
           </View>
            <View style={{ flex: 0.3 }} />
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  screenContainer: {
    flex: 0.85
  },
  profileImageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70)
  },
  nameText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10)
  },
  themeContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RFValue(20)
  },
  themeText: {
    color: "white",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15)
  }
});
