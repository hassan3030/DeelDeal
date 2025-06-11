"use client";
import  { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Navigation, Send, Loader2, Map } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@googlemaps/js-api-loader";
import Link from "next/link";

const Location = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const { toast } = useToast();

  const loadGoogleMaps = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Maps API key to load the map",
        variant: "destructive"
      });
      return;
    }

    try {
      const loader = new Loader({
        apiKey: apiKey,
        version: "weekly",
        libraries: ["places"]
      });

      const google = await loader.load();
      
      // Default to New York if no position is set
      const defaultCenter = currentPosition || { lat: 40.7128, lng: -74.0060 };
      
      const map = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      mapInstanceRef.current = map;

      // Add click listener to map
      map.addListener("click", (event) => {
        const position = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
          name: "Selected Location"
        };
        setSelectedPosition(position);
        addMarker(position);
        toast({
          title: "Location selected",
          description: `Lat: ${position.lat.toFixed(6)}, Lng: ${position.lng.toFixed(6)}`
        });
      });

      setIsMapLoaded(true);
      toast({
        title: "Map loaded",
        description: "Click on the map to select a location"
      });

    } catch (error) {
      console.error("Error loading Google Maps:", error);
      toast({
        title: "Map loading failed",
        description: "Please check your API key and try again",
        variant: "destructive"
      });
    }
  };

  const addMarker = (position) => {
    if (!mapInstanceRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Add new marker
    markerRef.current = new google.maps.Marker({
      position: { lat: position.lat, lng: position.lng },
      map: mapInstanceRef.current,
      title: position.name || "Selected Location",
      animation: google.maps.Animation.DROP,
    });

    // Center map on marker
    mapInstanceRef.current.setCenter({ lat: position.lat, lng: position.lng });
  };

  const getCurrentPosition = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser",
        variant: "destructive"
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          name: "Current Location"
        };
        setCurrentPosition(pos);
        setSelectedPosition(pos);
        
        if (mapInstanceRef.current) {
          addMarker(pos);
        }
        
        setIsGettingLocation(false);
        toast({
          title: "Current location found",
          description: `Lat: ${pos.lat.toFixed(6)}, Lng: ${pos.lng.toFixed(6)}`
        });
      },
      (error) => {
        let message = "Unable to retrieve your location";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive"
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const sendLocationToAPI = async () => {
    if (!selectedPosition) {
      toast({
        title: "No location selected",
        description: "Please select a location on the map first",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);
    
    try {
      // Replace with your actual API endpoint
      console.log("Sending location to API:", selectedPosition);
      
      // Example API call:
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     latitude: selectedPosition.lat,
      //     longitude: selectedPosition.lng,
      //     name: selectedPosition.name
      //   })
      // });

      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Location sent successfully",
        description: `Sent ${selectedPosition.name} to API`
      });
    } catch (error) {
      toast({
        title: "Failed to send location",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <header className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Location Manager</h1>
          <p className="text-muted-foreground">
            Select locations on Google Maps and send them to your API
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* API Key Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Google Maps Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Google Maps API Key</label>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Get your API key from Google Cloud Console
                </p>
              </div>
              <Button onClick={loadGoogleMaps} className="w-full" disabled={!apiKey}>
                Load Map
              </Button>
            </CardContent>
          </Card>

          {/* Current Position */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Current Position
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={getCurrentPosition} 
                disabled={isGettingLocation}
                className="w-full"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Get Current Location
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Selected Position */}
          {selectedPosition && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Selected Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Name:</strong> {selectedPosition.name}
                  </p>
                  <p className="text-sm">
                    <strong>Latitude:</strong> {selectedPosition.lat.toFixed(6)}
                  </p>
                  <p className="text-sm">
                    <strong>Longitude:</strong> {selectedPosition.lng.toFixed(6)}
                  </p>
                </div>
                <Button 
                  onClick={sendLocationToAPI} 
                  disabled={isSending}
                  className="w-full"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send to API
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Map</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click anywhere on the map to select a location
              </p>
            </CardHeader>
            <CardContent>
              <div 
                ref={mapRef} 
                className="w-full h-96 rounded-lg border"
                style={{ minHeight: '400px' }}
              >
                {!isMapLoaded && (
                  <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                    <div className="text-center">
                      <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Enter your Google Maps API key and click "Load Map"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Location;
