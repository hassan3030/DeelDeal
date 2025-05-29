"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


import { 
  Bell, 
  User, 
  MessageCircle, 
  Heart, 
  Package, 
  Clock,
  Check,
  X,
  Moon,
  Sun,
  Archive,
  ArrowRightLeft,
  MapPin,
  Star,
  Calendar,
  Eye
} from "lucide-react";
import { toast } from "sonner";
const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "swap_interest",
      title: "New Interest in Your Camera",
      message: "John Doe is interested in your Vintage Camera and wants to discuss the swap details",
      fromUser: "John Doe",
      userAvatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face",
      timestamp: "2024-01-20T10:30:00Z",
      isRead: false,
      location: "New York, NY",
      rating: 4.8,
      swapDetails: {
        swapName: "Camera for Guitar Swap",
        yourProduct: {
          name: "Vintage Canon AE-1 Camera",
          condition: "Excellent",
          estimatedValue: "$450",
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=150&fit=crop"
        },
        ownerProduct: {
          name: "Acoustic Guitar Yamaha FG800",
          condition: "Very Good",
          estimatedValue: "$420",
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=150&fit=crop"
        },
        ownerName: "John Doe"
      }
    },
    {
      id: 2,
      type: "swap_proposal",
      title: "Swap Proposal Received",
      message: "Sarah Wilson wants to swap her MacBook for your Guitar with additional terms",
      fromUser: "Sarah Wilson",
      userAvatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
      timestamp: "2024-01-20T09:15:00Z",
      isRead: false,
      location: "Los Angeles, CA",
      rating: 4.9,
      swapDetails: {
        swapName: "MacBook for Guitar Exchange",
        yourProduct: {
          name: "Acoustic Guitar Yamaha FG800",
          condition: "Very Good",
          estimatedValue: "$420",
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=150&fit=crop"
        },
        ownerProduct: {
          name: "MacBook Pro 2021 M1",
          condition: "Like New",
          estimatedValue: "$1,200",
          image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=150&fit=crop"
        },
        ownerName: "Sarah Wilson",
        additionalTerms: "Includes original charger and case"
      }
    },
    {
      id: 3,
      type: "message",
      title: "New Message",
      message: "Mike Johnson sent you a message about book collection availability and meeting details",
      fromUser: "Mike Johnson",
      userAvatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face",
      timestamp: "2024-01-19T16:45:00Z",
      isRead: true,
      location: "Chicago, IL",
      rating: 4.7,
      swapDetails: {
        swapName: "Books Collection Trade",
        yourProduct: {
          name: "Design Books Collection (5 books)",
          condition: "Good",
          estimatedValue: "$150",
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=150&fit=crop"
        },
        ownerProduct: {
          name: "Programming Books Set",
          condition: "Very Good",
          estimatedValue: "$180",
          image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=150&fit=crop"
        },
        ownerName: "Mike Johnson"
      }
    },
    {
      id: 4,
      type: "swap_accepted",
      title: "Swap Accepted!",
      message: "Emma Davis accepted your swap proposal and is ready to proceed with the exchange",
      fromUser: "Emma Davis",
      userAvatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face",
      timestamp: "2024-01-19T14:20:00Z",
      isRead: true,
      location: "Miami, FL",
      rating: 5.0,
      swapDetails: {
        swapName: "Watch for Headphones Swap",
        yourProduct: {
          name: "Vintage Watch Omega",
          condition: "Excellent",
          estimatedValue: "$800",
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=150&fit=crop"
        },
        ownerProduct: {
          name: "Sony WH-1000XM4 Headphones",
          condition: "Like New",
          estimatedValue: "$350",
          image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=150&fit=crop"
        },
        ownerName: "Emma Davis",
        meetingDate: "2024-01-25T15:00:00Z"
      }
    },
    {
      id: 5,
      type: "swap_completed",
      title: "Swap Completed",
      message: "Your swap with Alex Chen has been completed successfully. Don't forget to leave a review!",
      fromUser: "Alex Chen",
      userAvatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face",
      timestamp: "2024-01-18T11:30:00Z",
      isRead: true,
      location: "Seattle, WA",
      rating: 4.6,
      swapDetails: {
        swapName: "Gaming Console Exchange",
        yourProduct: {
          name: "PlayStation 5 Console",
          condition: "Like New",
          estimatedValue: "$500",
          image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=150&fit=crop"
        },
        ownerProduct: {
          name: "Xbox Series X Console",
          condition: "Very Good",
          estimatedValue: "$480",
          image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=150&fit=crop"
        },
        ownerName: "Alex Chen",
        completedDate: "2024-01-18T11:30:00Z"
      }
    }
  ]);

  

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast.success("Notification deleted");
  };

  const handleAccept = (notificationId) => {
    toast.success("Swap proposal accepted!");
    markAsRead(notificationId);
  };

  const handleDecline = (notificationId) => {
    toast.info("Swap proposal declined");
    markAsRead(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "swap_interest": return <Heart className="h-5 w-5 text-red-500" />;
      case "swap_proposal": return <Package className="h-5 w-5 text-blue-500" />;
      case "message": return <MessageCircle className="h-5 w-5 text-green-500" />;
      case "swap_accepted": return <Check className="h-5 w-5 text-green-500" />;
      case "swap_completed": return <Check className="h-5 w-5 text-purple-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const formatMeetingDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-8 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-background flex items-center">
              <Bell className="mr-3 h-8 w-8" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-3 bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </h1>
            <p className="text-background/90 mt-2">Stay updated with your swap activities</p>
          </div>
          
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
            <Button variant="outline">
              <Archive className="h-4 w-4 mr-2" />
              Archive All
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-all hover:shadow-lg ${
                !notification.isRead ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* User Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                    <img 
                      src={notification.userAvatar} 
                      alt={notification.fromUser}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center" style={{display: 'none'}}>
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getNotificationIcon(notification.type)}
                        <h3 className="font-semibold text-sm">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeAgo(notification.timestamp)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {notification.message}
                    </p>

                    {/* User Info Section */}
                    <div className="flex items-center space-x-4 mb-4 p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{notification.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{notification.rating}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {notification.fromUser}
                      </Badge>
                    </div>

                    {/* Swap Details Card */}
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-sm">{notification.swapDetails.swapName}</h4>
                        <Badge variant="outline" className="text-xs">
                          Swap ID: #{notification.id}00{notification.id}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        {/* Your Product */}
                        <div className="text-center space-y-3">
                          <p className="text-xs text-muted-foreground font-medium">Your Product</p>
                          <div className="bg-background rounded-lg p-3 space-y-2">
                            <img 
                              src={notification.swapDetails.yourProduct.image} 
                              alt={notification.swapDetails.yourProduct.name}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <p className="text-sm font-medium">{notification.swapDetails.yourProduct.name}</p>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Condition: {notification.swapDetails.yourProduct.condition}</span>
                              <span className="font-medium text-green-600">{notification.swapDetails.yourProduct.estimatedValue}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Swap Arrow */}
                        <div className="flex flex-col items-center space-y-2">
                          <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Exchange</span>
                        </div>
                        
                        {/* Owner Product */}
                        <div className="text-center space-y-3">
                          <p className="text-xs text-muted-foreground font-medium">Their Product</p>
                          <div className="bg-background rounded-lg p-3 space-y-2">
                            <img 
                              src={notification.swapDetails.ownerProduct.image} 
                              alt={notification.swapDetails.ownerProduct.name}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <p className="text-sm font-medium">{notification.swapDetails.ownerProduct.name}</p>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Condition: {notification.swapDetails.ownerProduct.condition}</span>
                              <span className="font-medium text-green-600">{notification.swapDetails.ownerProduct.estimatedValue}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      {notification.swapDetails.additionalTerms && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            <strong>Additional Terms:</strong> {notification.swapDetails.additionalTerms}
                          </p>
                        </div>
                      )}

                      {notification.swapDetails.meetingDate && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <p className="text-sm text-green-700 dark:text-green-300">
                            <strong>Meeting Scheduled:</strong> {formatMeetingDate(notification.swapDetails.meetingDate)}
                          </p>
                        </div>
                      )}

                      {notification.swapDetails.completedDate && (
                        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg flex items-center space-x-2">
                          <Check className="h-4 w-4 text-purple-600" />
                          <p className="text-sm text-purple-700 dark:text-purple-300">
                            <strong>Completed:</strong> {formatMeetingDate(notification.swapDetails.completedDate)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        From: {notification.fromUser}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 px-3"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {notification.type === "swap_proposal" && !notification.isRead && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleAccept(notification.id)}
                              className="h-8 px-3"
                            >
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDecline(notification.id)}
                              className="h-8 px-3"
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        {!notification.isRead && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 px-3"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 px-3 text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {notifications.length === 0 && (
          <Card className="p-12 text-center">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! New notifications will appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Notifications;
