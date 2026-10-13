import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiRequest } from "../services/api";
import BrandLogo from "../components/BrandLogo";