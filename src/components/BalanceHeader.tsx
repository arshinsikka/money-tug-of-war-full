import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BalanceHeader({ me, friend, meDollars, friendDollars }:{me:string; friend:string; meDollars:number; friendDollars:number;}){
  return (<View style={s.c}>
    <Text style={s.t}>{me}: ${meDollars}</Text><Text style={{marginHorizontal:8,color:'#888'}}>|</Text>
    <Text style={s.t}>{friend}: ${friendDollars}</Text>
  </View>);
}
const s = StyleSheet.create({ c:{flexDirection:'row',justifyContent:'center',paddingVertical:8}, t:{fontSize:18,fontWeight:'600'} });
