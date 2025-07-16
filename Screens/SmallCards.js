import React from 'react';
import { View, Text, Image, ImageBackground, Pressable } from 'react-native';

const SmallGridItem = ({
  title,
  backgroundImage,
  iconImage,
  onPress,
  styles,
  customBgStyle,
}) => {
  return (
    <View style={styles.shadowWrap}>
      <Pressable onPress={onPress} style={styles.smallGridItemWrapper}>
        <ImageBackground
          source={backgroundImage}
          resizeMode="cover"
          style={styles.smallGridImageBackground}
          imageStyle={customBgStyle}
        >
          <View style={styles.smallGridItem}>
            <Text style={styles.gridItemTitle}>{title}</Text>
            {iconImage && (
              <View style={styles.imageContainer}>
                <Image
                  source={iconImage}
                  style={styles.weightLossImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        </ImageBackground>
      </Pressable>
    </View>
  );
};

export default SmallGridItem;
