
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import container from '../../../container';
import { GetSampleDataUseCase } from '../../application/usecases/GetSampleDataUseCase';
import { GetSampleDataUseCaseToken } from '../../tokens';
import { fetchDataStart, fetchDataSuccess, fetchDataFailure } from '../state/sample.slice';
import { RootState, AppDispatch } from '../../../providers/store';

const SampleScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.sample);

  const getSampleDataUseCase = container.resolve<GetSampleDataUseCase>(
    GetSampleDataUseCaseToken
  );

  const fetchData = async () => {
    dispatch(fetchDataStart());
    try {
      const result = await getSampleDataUseCase.execute();
      dispatch(fetchDataSuccess(result));
    } catch (e) {
      dispatch(fetchDataFailure(e.message));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <Text style={styles.text}>{data}</Text>
      )}
      <Button title="Reload" onPress={fetchData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default SampleScreen;
