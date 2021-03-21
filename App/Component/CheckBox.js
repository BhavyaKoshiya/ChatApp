import React from 'react';
import { View, Text, TextInput, iconStyle, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { checkIcon } from '../assets/icon/index'

export function Check({
    isChecked,
    source,
    onPress,
    title,
    contentContainerStyle,
    checkboxStyle,
    titleStyle,
    ...Other
}) {

    return (
        <TouchableOpacity
            onPress={onPress} {...Other}>
            <View style={{ flexDirection: 'row',alignItems:"center" }}>
                <View
                   
                    style={[styles.checkboxContainer, contentContainerStyle, { backgroundColor: isChecked ? "#ea8478" : "transparent" }]}
                    >

                    {(isChecked) && <Image source={source || checkIcon} style={[styles.checkStyle,checkboxStyle]} />}
                </View>
                
                {title && <Text style={[styles.titleText,titleStyle]}> {title}</Text>}
            </View>
        </TouchableOpacity>

    )
}
const styles = StyleSheet.create({
    checkboxContainer: {
        borderWidth: 1,
        borderColor: "#ea8478",
        width: 20,
        height: 20,
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center"
    },
    checkStyle: {
        width: 12,
        height: 12,
        resizeMode: "contain",
        tintColor: "#fff"
    },
    titleText:{ color: '#959595',marginLeft:10 }

});
