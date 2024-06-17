import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import useTheme from '../hooks/useTheme';

import {useState} from 'react';

import Incomes from '../components/ListIncomes';
import Expenenss from '../components/ListExpenens';

function HomeScreen({navigation}) {
  const [getScreen, setScreen] = useState(false);
  const {colorScheme, toggleTheme} = useTheme();

  return (
    <SafeAreaView style={[{backgroundColor: '#fff'}, {flex: 1}]}>
      <View style={styles.main}>
        <TouchableOpacity onPress={() => setScreen(true)}>
          <Text
            style={[
              styles.textstyle,
              {
                color: 'black',
                textDecorationLine: getScreen ? 'underline' : 'none',
              },
            ]}>
            Расходы
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen(false)}>
          <Text
            style={[
              styles.textstyle,
              {
                color: 'black',
                textDecorationLine: getScreen ? 'none' : 'underline',
              },
            ]}>
            Доходы
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{justifyContent: 'center'}}>
        <Text></Text>
      </View>

      {getScreen ? <Expenenss /> : <Incomes />}
      <View
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          margin: 5,
        }}>
        <Text
          onPress={() =>
            getScreen
              ? navigation.navigate('Expenens', {colorScheme: colorScheme})
              : navigation.navigate('Income', {colorScheme: colorScheme})
          }
          style={[styles.textstyle1, {color: 'black'}]}>
          +
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },

  textstyle: {
    borderColor: 'gray',
    fontSize: 38,
    fontWeight: 'bold',
  },

  textstyle1: {
    borderRadius: 25,

    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textstyle3: {
    borderWidth: 2,
    borderRadius: 10,
    fontSize: 20,
    fontWeight: 'bold',
    margin: 5,
    height: 50,
    textAlign: 'center',
  },
});

export default HomeScreen;
