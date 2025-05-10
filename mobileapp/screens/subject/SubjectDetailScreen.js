import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Video from "react-native-video";
import * as FileSystem from "expo-file-system";
import APIEndPoints from "../../middleware/APIEndPoints";
import axios from "axios";

const initialLayout = { width: Dimensions.get("window").width };

export default function SubjectDetailScreen() {
  const route = useRoute();
  const { subject } = route.params;
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "videos", title: "Videos" },
    { key: "pdfs", title: "PDFs" },
  ]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [localVideoUri, setLocalVideoUri] = useState(null); // For downloaded video
  const videoRef = useRef(null);

  const videos = subject.video
    ? [
        {
          id: "subject-video",
          title: `${subject.name} Intro Video`,
          url: subject.video,
          downloadUrl: `${APIEndPoints.download_video.url}/${subject._id}`,
        },
      ]
    : [];

  const pdfs = subject.pdf
    ? [
        {
          id: "subject-pdf",
          title: `${subject.name} Syllabus`,
          url: subject.pdf,
          downloadUrl: `${APIEndPoints.download_pdf.url}/${subject._id}`,
        },
      ]
    : [];

  const downloadFile = async (downloadUrl, filename, type) => {
    try {
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      const { uri } = await FileSystem.downloadAsync(downloadUrl, fileUri);
      Alert.alert("Success", `${type} downloaded to ${uri}`);
      if (type === "Video") {
        setLocalVideoUri(uri); // Update to use downloaded video
        setVideoError(null);
      }
    } catch (error) {
      console.error(`Download ${type} error:`, error);
      Alert.alert("Error", `Failed to download ${type.toLowerCase()}: ${error.message}`);
    }
  };

  const handleVideoError = (error) => {
    console.log("Video playback error:", JSON.stringify(error));
    setVideoError("Failed to play video. Try downloading instead.");
    setVideoLoading(false);
  };

  const VideosScene = () => (
    <ScrollView className="flex-1" nestedScrollEnabled={true}>
      <View className="bg-white rounded-lg shadow-sm p-4 border border-secondary/20">
        {videos.length > 0 ? (
          videos.map((video) => (
            <View key={video.id} className="p-3 border-b border-secondary/10">
              <Text className="text-primary">{video.title}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedVideo(video);
                  setModalVisible(true);
                  setVideoError(null);
                  setVideoLoading(true);
                }}
                className="mt-2"
              >
                <Text className="text-blue-500">Play Video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  downloadFile(video.downloadUrl, `video-${subject.name}.mp4`, "Video")
                }
                className="mt-2"
              >
                <Text className="text-blue-500">Download Video</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text className="text-gray-600 text-center p-4">
            No video available
          </Text>
        )}
      </View>
    </ScrollView>
  );

  const PDFsScene = () => (
    <ScrollView className="flex-1" nestedScrollEnabled={true}>
      <View className="bg-white rounded-lg shadow-sm p-4 border border-secondary/20">
        {pdfs.length > 0 ? (
          pdfs.map((pdf) => (
            <View key={pdf.id} className="p-3 border-b border-secondary/10">
              <Text className="text-primary">{pdf.title}</Text>
              <TouchableOpacity
                onPress={() =>
                  downloadFile(pdf.downloadUrl, `pdf-${subject.name}.pdf`, "PDF")
                }
                className="mt-2"
              >
                <Text className="text-blue-500">Download PDF</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text className="text-gray-600 text-center p-4">
            No PDF available
          </Text>
        )}
      </View>
    </ScrollView>
  );

  const renderScene = SceneMap({
    videos: VideosScene,
    pdfs: PDFsScene,
  });

  const handleCloseModal = () => {
    if (videoRef.current) {
      videoRef.current.seek(0);
    }
    setModalVisible(false);
    setTimeout(() => {
      setSelectedVideo(null);
      setLocalVideoUri(null);
      setVideoError(null);
      setVideoLoading(false);
    }, 300);
  };

  return (
    <View className="flex-1 bg-tertiary">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true}
      >
        <View className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-secondary/20">
          <View className="flex-row items-center mt-3">
            <Text className="text-2xl font-bold text-primary">
              {subject.name} ({subject.code})
            </Text>
            <Text className="text-sm text-primary ml-auto bg-amber-500 rounded-3xl px-2">
              Credits: {subject.creditHours}
            </Text>
          </View>
          <Image
            source={{ uri: subject.image }}
            className="w-full h-48 rounded-lg"
            resizeMode="cover"
            defaultSource={{
              uri: "https://play-lh.googleusercontent.com/2kD49Sc5652DmjJNf7Kh17DEXx9HiD2Zz3LsNc6929yTW6VBbGBCr-CQLoOA7iUf6hk",
            }}
          />
          {subject.description && (
            <Text className="text-sm text-gray-600 mt-2">
              {subject.description}
            </Text>
          )}
        </View>
        <View style={{ height: Dimensions.get("window").height * 0.6 }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                renderLabel={({ route, focused }) => (
                  <Text
                    className={`text-base font-semibold ${
                      focused ? "text-primary" : "text-secondary"
                    }`}
                  >
                    {route.title}
                  </Text>
                )}
              />
            )}
          />
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 bg-black/80 justify-center items-center">
          {selectedVideo && (
            <View className="bg-white rounded-lg p-4 w-11/12">
              <Text className="text-lg font-bold text-primary mb-2">
                {selectedVideo.title}
              </Text>
              {videoError ? (
                <Text className="text-error mb-2">{videoError}</Text>
              ) : videoLoading ? (
                <ActivityIndicator size="large" color="#3D3BF3" />
              ) : null}
              <Video
                ref={videoRef}
                source={{ uri: localVideoUri || selectedVideo.url }}
                style={{ width: "100%", height: 200, backgroundColor: "black" }}
                controls={true}
                resizeMode="contain"
                paused={!modalVisible}
                onError={handleVideoError}
                onLoad={() => setVideoLoading(false)}
                onLoadStart={() => setVideoLoading(true)}
              />
              <Pressable
                className="mt-4 p-2 bg-primary rounded-lg"
                onPress={handleCloseModal}
              >
                <Text className="text-white text-center">Close</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}