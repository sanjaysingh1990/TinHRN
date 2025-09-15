
import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TestScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => bottomSheetRef.current?.expand()}
        >
          <Text>Open Bottom Sheet</Text>
        </TouchableOpacity>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: 'tomato' }}
        >
          <View style={styles.content}>
            <Text>Awesome 🎉</Text>
          </View>
        </BottomSheet>
      </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 20,
    backgroundColor: 'lightblue',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
});

export default TestScreen;
