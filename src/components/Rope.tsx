import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function Rope({ meEmoji, friendEmoji, balanceCents }:{meEmoji:string; friendEmoji:string; balanceCents:number;}){
  const translate = useRef(new Animated.Value(0)).current;
  const last = useRef(0);
  useEffect(()=>{
    const normalized = Math.max(-1, Math.min(1, balanceCents/1000));
    Animated.timing(translate,{ toValue: normalized*100, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    if(Math.sign(last.current) !== Math.sign(balanceCents)){ Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }
    last.current = balanceCents;
  },[balanceCents]);
  return (<View style={{alignItems:'center',width:'100%'}}>
    <View style={{flexDirection:'row',alignItems:'center',width:'100%',paddingHorizontal:12}}>
      <Text style={{fontSize:28,width:40,textAlign:'center'}}>{meEmoji}</Text>
      <View style={{flex:1,height:24,justifyContent:'center'}}>
        <View style={{height:4,borderRadius:2,backgroundColor:'#c9a86a'}}/>
        <Animated.View style={{position:'absolute',left:'50%',marginLeft:-11,top:2, transform:[{translateX: translate}]}}>
          <Text style={{fontSize:22}}>💰</Text>
        </Animated.View>
      </View>
      <Text style={{fontSize:28,width:40,textAlign:'center'}}>{friendEmoji}</Text>
    </View>
    <Text style={{marginTop:6,color:'#666'}}>Tug the money by finishing tasks!</Text>
  </View>);
}
