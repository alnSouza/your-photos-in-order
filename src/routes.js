import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home';
import newAlbum from './pages/CreateAlbum';
import Galery from './pages/Galery';
import Album from './pages/Album';
import Picture from './pages/PictureShow';
const Stack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none" initialRouteName="Home">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="newAlbum" component={newAlbum} />
                <Stack.Screen name="Galeria" component={Galery} />
                <Stack.Screen name="Album" component={Album} />
                <Stack.Screen name="Picture" component={Picture} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Routes;