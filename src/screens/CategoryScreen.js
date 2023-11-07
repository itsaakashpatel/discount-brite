import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import QuoteCard from '../components/QuoteCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoryScreen = ({route}) => {
  const {categoryName} = route.params;
  const [allQuotes, setAllQuotes] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('quotes')
      .then((jsonQuotes) => {
        if (jsonQuotes) {
          const parsedQuotes = JSON.parse(jsonQuotes);
          setAllQuotes(parsedQuotes);
        }
      })
      .catch((error) => console.error('Error loading quotes:', error));
  }, []);

  const quotesForCategory = allQuotes.filter((quote) => quote.categories.includes(categoryName));

  function deleteQuote(quoteId) {
    const updatedQuotes = allQuotes.filter((quote) => quote._id !== quoteId);
    setAllQuotes(updatedQuotes);
    AsyncStorage.setItem('quotes', JSON.stringify(updatedQuotes))
      .then(() => {
        console.log('Quote deleted and quotes updated successfully');
      })
      .catch((error) => console.error('Error deleting quote:', error));
  }

  function favouriteQuoteHandler(value) {
    const updatedLikedQuotes = allQuotes.reduce((accumulator, currentQuote) => {
      if (currentQuote._id === value.id) {
        currentQuote.isLiked = value.isLiked; // Update isLiked property
      }
      return [...accumulator, currentQuote];
    }, []);

    setAllQuotes(updatedLikedQuotes);
    AsyncStorage.setItem('quotes', JSON.stringify(updatedLikedQuotes))
      .then(() => {
        console.log('Quote updated and quotes updated successfully');
      })
      .catch((error) => console.error('Error in updating quote:', error));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Category: {categoryName}</Text>
      <FlatList
        data={quotesForCategory}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <QuoteCard
            quote={item}
            onDelete={deleteQuote}
            favouriteQuoteHandler={favouriteQuoteHandler}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quoteItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CategoryScreen;
