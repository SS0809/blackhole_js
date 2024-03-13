import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { encode } from 'base-64';
import * as Progress from 'react-native-progress';
import {API_URL} from "@env";
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}



function AppHeader(): React.JSX.Element {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>nodflix</Text>
    </View>
  );
}


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get("https://k1qsh8ytwc.execute-api.ap-southeast-2.amazonaws.com/default/TELECORE?limit=100&blackhole_js=true&offset=10");
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
 // Empty dependency array means this effect runs once after the initial render
  const teleOpenUrl = (data) => {
    const str = 'text=' + data;
    const encodedStr = encode(str);
    const openUrl = 'https://t.me/nodflix_movie_bot?start=' + encodedStr;

    console.log('Generated URL:', openUrl);

    Linking.openURL(openUrl)
      .then(() => console.log('URL opened successfully'))
      .catch((error) => console.error('Error opening URL:', error));
  };



  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <AppHeader />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
           {loading && (
           <View style={[styles.container, styles.horizontal]}>
           <ActivityIndicator size="large" color="#91171d" />
           </View>
           )}

          {/* Dynamic Sections */}
          {data && data.map((item, index) => (
          <Section key={index}>
             <Image
                source={{uri: "https://ucarecdn.com/"+item.img_data[index]+"/"}}
                style={{width: 360, height: 160}}
              />
              <Text  style={{
               color: Colors.white,
               fontSize:14
               }}> {item.movie_name + '     ' + item.size_mb + 'MB' }</Text>
            <Button
               onPress={ ()=>{teleOpenUrl(item.telegram)}}
               title="Download from telegram"
               color="#91171d"
               fontSize="12"
             />
          </Section>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize:18,
    marginBottom: -40,
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
   header: {
      backgroundColor: '#91171d',
      padding: 10,
      alignItems: 'left',
    },
    headerText: {
      color: '#fff',
      fontSize: 20,
    },
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
horizontal: {
    justifyContent: 'center',
    alignItems: 'center', // Center vertically
    paddingTop: 400,
    paddingBottom: 400,
},
});

export default App;
