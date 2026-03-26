import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  FlatList,
  Image as RNImage,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AudioItem = {
  id: string;
  title: string;
  duration: string;
  spriteIndex: number;
};

const BG = "#FFFFFF";
const LINE = "rgba(17,17,17,0.16)";
const LINE_SOFT = "rgba(17,17,17,0.08)";
const MIST = "rgba(17,17,17,0.03)";
const WHITE = "#111111";
const WHITE_DIM = "rgba(17,17,17,0.58)";
const WHITE_FAINT = "rgba(17,17,17,0.38)";
const ICON_SHEET = require("../../assets/app-images/spiritual-icons.png");
const ICON_SHEET_COLS = 8;
const ICON_SHEET_ROWS = 12;
const ICON_SIZE = 46;
const ICON_SHEET_WIDTH = ICON_SIZE * ICON_SHEET_COLS;
const ICON_SHEET_HEIGHT = ICON_SIZE * ICON_SHEET_ROWS;

const TITLES = [
  "The Curious Child",
  "The Strength Within",
  "Subconscious Roots",
  "Beginner’s Mind",
  "The Fearless Spark",
  "The Quiet Power",
  "The Hidden Giant",
  "The Courage Code",
  "The Inner Flame",
  "The Unshaken Self",
  "The Brave Unknown",
  "The Secret of Ease",
  "The Magnetic Presence",
  "The Confidence Instinct",
  "The Wild Heart",
  "The Open Door Within",
  "The Lion Beneath",
  "The Confident Current",
  "The Original Self",
  "The Bold Awakening",
] as const;

const DURATIONS = [
  "4:12",
  "6:08",
  "5:44",
  "7:03",
  "3:58",
  "6:30",
  "5:21",
  "4:47",
  "6:54",
  "5:11",
  "7:22",
  "4:25",
  "6:03",
  "5:36",
  "4:50",
  "6:42",
  "5:07",
  "4:40",
  "6:18",
  "5:33",
] as const;

const audioItems: AudioItem[] = TITLES.map((title, index) => ({
  id: `m-${index + 1}`,
  title,
  duration: DURATIONS[index],
  spriteIndex: index,
}));

function getSpriteOffset(spriteIndex: number) {
  const col = spriteIndex % ICON_SHEET_COLS;
  const row = Math.floor(spriteIndex / ICON_SHEET_COLS);

  return {
    x: -(col * ICON_SIZE),
    y: -(row * ICON_SIZE),
  };
}

export default function MomentsScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <FlatList
        data={audioItems}
        numColumns={5}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.column}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.headerCard}>
              <View style={styles.headerOrnament}>
                <View style={styles.ornamentLine} />
                <View style={styles.ornamentDiamond} />
                <View style={styles.ornamentLine} />
              </View>
              <Text style={styles.eyebrow}>WHISPERS</Text>
              <Text style={styles.screenTitle}>Moments</Text>
              <View style={styles.titleUnderline} />
              <Text style={styles.subtitle}>
                Trace a symbol. Each opens a short passage — a breath between
                thoughts.
              </Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          (() => {
            const offset = getSpriteOffset(item.spriteIndex);

            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/lesson/[id]",
                    params: {
                      id: item.id,
                      title: item.title,
                      duration: item.duration,
                      author: "Moments",
                      category: "Moment",
                    },
                  })
                }
                style={({ pressed }) => [
                  styles.gridItem,
                  index > 1 && styles.gridItemInactive,
                  { opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <View style={styles.glyphRingOuter}>
                  <View style={styles.glyphRingInner}>
                    <View style={styles.spriteViewport}>
                      <RNImage
                        source={ICON_SHEET}
                        style={[
                          styles.spriteSheet,
                          {
                            transform: [
                              { translateX: offset.x },
                              { translateY: offset.y },
                            ],
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
                <Text style={styles.indexLabel}>
                  {`${index + 1}`.padStart(2, "0")}
                </Text>
              </Pressable>
            );
          })()
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  headerBlock: {
    marginBottom: 28,
  },
  headerCard: {
    borderWidth: 1,
    borderColor: LINE,
    paddingVertical: 22,
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
  },
  headerOrnament: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  ornamentLine: {
    width: 36,
    height: 1,
    backgroundColor: LINE,
  },
  ornamentDiamond: {
    width: 6,
    height: 6,
    backgroundColor: WHITE_FAINT,
    transform: [{ rotate: "45deg" }],
  },
  eyebrow: {
    textAlign: "center",
    fontSize: 10,
    letterSpacing: 3.5,
    color: WHITE_DIM,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
  },
  screenTitle: {
    textAlign: "center",
    fontSize: 36,
    lineHeight: 42,
    color: WHITE,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  titleUnderline: {
    alignSelf: "center",
    width: 48,
    height: 1,
    backgroundColor: LINE,
    marginTop: 14,
    marginBottom: 16,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    color: WHITE_DIM,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 4,
    letterSpacing: 0.2,
  },
  column: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gridItem: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  gridItemInactive: {
    opacity: 0.42,
  },
  glyphRingOuter: {
    width: 62,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LINE,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: MIST,
  },
  glyphRingInner: {
    width: 50,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LINE_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  spriteViewport: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    overflow: "hidden",
  },
  spriteSheet: {
    width: ICON_SHEET_WIDTH,
    height: ICON_SHEET_HEIGHT,
  },
  indexLabel: {
    marginTop: 8,
    fontSize: 9,
    lineHeight: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.2,
    color: WHITE_FAINT,
  },
});
