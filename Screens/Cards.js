import { Dimensions, StyleSheet, Text, View, Image, Pressable, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

const Card = ({ title, subtitle, imageSource, onPress }) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.cardImageWrapper}>
      <Image style={styles.cardImage} source={imageSource} resizeMode="cover" />
    </View>
    <View style={styles.cardTextWrapper}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  </Pressable>
);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  cardWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: (width - 30) / 2, // Responsive width for 2 cards per row
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageWrapper: {
    width: "100%",
    height: 150,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardTextWrapper: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});

export default Card;
