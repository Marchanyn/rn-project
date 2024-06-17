import {StyleSheet, SafeAreaView, TextInput, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';
import {Picker} from '@react-native-picker/picker';

function Income({route, navigation}) {
  const [input1, setinput1] = useState('');
  const [input2, setinput2] = useState('');
  const [valueOfExpenens, setValueOfExpenens] = useState('');
  const [tasks, setTasks] = useState([]);

  if (isNaN(input2)) {
    alert('Invalid input: please enter a numeric value');
    return;
  }

  const handleSavePress = async () => {
    if (input2 == '') {
      Alert.alert('', 'Введите сумму дохода');
      return;
    } else if (valueOfExpenens == '') {
      Alert.alert('', 'Введите категорию дохода');
      return;
    }
    const data = {
      title: input1,
      descr: parseInt(input2, 10),
      typeOfExpenens: valueOfExpenens,
      timestamp: new Date().toString(),
    };

    const oldData = await AsyncStorage.getItem('income');
    const newData = oldData ? JSON.parse(oldData).concat(data) : [data];

    await AsyncStorage.setItem('income', JSON.stringify(newData));
    setTasks(newData);
    navigation.goBack();
  };

  const {colorScheme} = route.params;
  return (
    <SafeAreaView style={[styles.home, {backgroundColor: '#e4e8e9'}]}>
      <TextInput
        onChangeText={text => setinput2(text)}
        style={[
          styles.textstyle,
          {color: String(colorScheme) === 'dark' ? 'white' : '#1f1f1f'},
        ]}
        placeholder="0"
        keyboardType="numeric"></TextInput>
      <TextInput
        onChangeText={text => setinput1(text)}
        style={[
          styles.textstyle,
          {color: String(colorScheme) === 'dark' ? 'white' : '#1f1f1f'},
        ]}
        placeholder="Комментарий"></TextInput>
      <Picker
        style={{width: '80%', height: 40}}
        selectedValue={valueOfExpenens}
        onValueChange={text => setValueOfExpenens(text)}
        numberOfLines={1}>
        <Picker.Item label="Работа" value="Работа" />
        <Picker.Item label="Вклад" value="Вклад" />
        <Picker.Item label="Инвестиции" value="Инвестиции" />
        <Picker.Item label="Другое" value="Другое" />
      </Picker>
      <Button onPress={handleSavePress} title="Сохранить" />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textstyle: {
    fontSize: 24,
  },
});

export default Income;
