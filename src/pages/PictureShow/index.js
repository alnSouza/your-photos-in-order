import React, { useState, useEffect } from 'react';
import { View, Text, Image, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import Share from 'react-native-share';


const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const Picture = () => {
    const route = useRoute();
    const routeParams = route.params;
    const navigation = useNavigation();
    
    const [file, setFile] = useState('');

    const onShare = async () => {
        await Share.open({
            message: '',
            title: file,
            url: file,
            activityItemSources: [{thumbnailImage: file}]
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
              navigation.navigate('Home');
            } else {
                navigation.navigate('Home');
                    // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    }

    useEffect(() => {
        const file_path = routeParams['path_file'];
        setFile(file_path);
    }, []);

    function handleGoBack(){
        navigation.goBack();
    }

    return(
        <View style={{backgroundColor: 'black'}}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={[styles.btn]} onPress={handleGoBack}>
                        <Icon name="arrow-left" color="rgba(4, 137, 246, 0.932)" size={30} />
                    </TouchableOpacity>
                    <View style={[styles.options]}>
                        <View style={{flexDirection: 'row-reverse'}}>
                            <TouchableOpacity onPress={onShare} style={styles.btn}>
                                <Icon name="share-2" color="rgba(4, 137, 246, 0.932)" size={25} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => {}} style={styles.btn}>
                                <Menu>
                                    <MenuTrigger>
                                        <Icon name="folder" color="rgba(4, 137, 246, 0.932)" size={25} />
                                    </MenuTrigger>
                                    <MenuOptions>
                                        {albums.map((album, index) => 
                                        <MenuOption key={index} onSelect={() => addToAlbum(album.file)} style={{height:40, alignItems: 'center', flexDirection: 'row'}}>
                                            <Icon name="folder" size={20} />
                                            <Text style={{marginLeft:5}}>{album.file.replace(".json", '')}</Text>
                                        </MenuOption>
                                        )}
                                    </MenuOptions>
                                </Menu>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            <ScrollView alwaysBounceVertical >
                <Image style={styles.container} source={{uri: file}}></Image>
            </ScrollView>
        </View>
        
    );
};

const styles = StyleSheet.create({
        container: {
            width: Width,
            height: Height,
            resizeMode: "contain"
        },
        options:{
            alignItems: 'flex-end', width: Width / 1.2
          },
        btn:{
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
    }
);

export default Picture;