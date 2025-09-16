import React from 'react';
import MapViewExploreScreenFallback from './MapViewExploreScreenFallback';

interface MapViewExploreScreenWrapperProps {
  hideHeader?: boolean;
}

interface WrapperState {
  hasError: boolean;
  MapComponent: React.ComponentType<any> | null;
}

class MapViewExploreScreenWrapper extends React.Component<MapViewExploreScreenWrapperProps, WrapperState> {
  constructor(props: MapViewExploreScreenWrapperProps) {
    super(props);
    this.state = { 
      hasError: false,
      MapComponent: null
    };
  }

  async componentDidMount() {
    try {
      // Dynamically import the maps component to avoid top-level import errors
      const { default: MapViewExploreScreen } = await import('./MapViewExploreScreen');
      this.setState({ MapComponent: MapViewExploreScreen });
    } catch (error) {
      console.warn('Maps module not available, using fallback:', error);
      this.setState({ hasError: true });
    }
  }

  static getDerivedStateFromError(error: any) {
    console.warn('Maps module error, using fallback:', error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn('Maps component error:', error, errorInfo);
  }

  render() {
    const { MapComponent, hasError } = this.state;
    
    if (hasError || !MapComponent) {
      return <MapViewExploreScreenFallback {...this.props} />;
    }

    try {
      return <MapComponent {...this.props} />;
    } catch (error) {
      console.warn('Maps render error, using fallback:', error);
      return <MapViewExploreScreenFallback {...this.props} />;
    }
  }
}