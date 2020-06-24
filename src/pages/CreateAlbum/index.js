import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    Dimensions, 
    Image, TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import Storage from '../../actions/AccesStorage/storage.js';
const storage = new Storage();
const WIDTH = Dimensions.get('window').width;

const newAlbum = () => {
    const navigation = useNavigation();
    
    const [folderExists , setBolFolder] = useState();
    const [nameAlbum, setNameAlbum] = useState('');
    
    RNFetchBlob.fs.isDir(RNFetchBlob.fs.dirs.SDCardDir+"/DataGalery").then(res => {
        setBolFolder(res);
    });
    
    if(folderExists === false) {
        storage.createFolder();
    }

    async function createAlbum(name) {
      let response = await storage.createFile(name);
        if(response == true){
            navigation.navigate('Home', { albums: true });
            Alert.alert(
                'Sucesso',
                'Novo album pronto!'
            );
        } else {
            Alert.alert(
                'Erro',
                'Não foi possivel salvar o arquivo, '+
                'Verifique as permissões e tente novamente!',
            );
        }
    }
    function handleNavigateBack() {
        navigation.goBack();
    }
    return(
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding': null} style={{position: 'relative'}} enabled={false}>
            <View backgroundColor="#FFF">
                <TouchableOpacity style={styles.btnToBack} onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={34} color="rgba(4, 137, 246, 0.932)"/>
                </TouchableOpacity>
            </View>
            <View backgroundColor="black">
                <Image source={require('../../assets/banner.png')} style={{width: WIDTH, resizeMode: 'cover'}}/>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                <TextInput style={styles.input} Keyboard
                value={nameAlbum} autoCorrect={false}
                maxLength={30} 
                onChangeText={(text) => {setNameAlbum(text)}} 
                placeholder="Novo album"></TextInput>
                <TouchableOpacity style={styles.button} onPress={() => {createAlbum(nameAlbum)}}>
                    <Icon name="check" color="rgba(4, 137, 246, 0.932)" size={24} />
                </TouchableOpacity>
            </View>
            
        </KeyboardAvoidingView>     
    );
};

const styles = StyleSheet.create({
    input: {
        width: 250,
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        margin: 5,
        paddingHorizontal: 24,
        fontSize: 16,
    },
    btnToBack:{
        backgroundColor: 'rgba(245, 249, 252, 0.993)', 
        width:40,
        height:40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginTop: 5,
        marginEnd: 2,
        marginLeft: 5,
        marginBottom:15
      },
    button: {
        backgroundColor: '#FFF',
        width: 60,
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    }
})

export default newAlbum;