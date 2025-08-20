import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, Palette, Users, Heart, Camera, 
  Save, Download, ShoppingCart, LogIn, UserPlus,
  Upload, X, CheckCircle, Loader2, Sparkles
} from 'lucide-react';

const PersonalStylingPlatform = () => {
  // User Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [userCredentials, setUserCredentials] = useState({
    email: '', password: '', confirmPassword: '', name: ''
  });

  // Analysis States
  const [currentStep, setCurrentStep] = useState(1);
  const [analysisData, setAnalysisData] = useState({
    personalInfo: {
      name: '', age: '', gender: '', height: '', weight: ''
    },
    bodyShape: {
      bust: '', waist: '', hips: '', shoulders: '', 
      bodyType: '', concerns: [], goals: [], selectionMethod: ''
    },
    colorAnalysis: {
      hairColor: '', eyeColor: '', skinTone: '', undertone: '',
      season: '', dominantCharacteristic: '', secondaryCharacteristic: '', selectionMethod: ''
    },
    values: {
      sustainability: 0, luxury: 0, comfort: 0, trendiness: 0,
      budget: '', lifestyle: '', priorities: []
    },
    photos: []
  });

  // Results and AI States
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [promptA, setPromptA] = useState('');
  const [promptB, setPromptB] = useState('');
  const [finalResults, setFinalResults] = useState(null);
  const [savedAnalyses, setSavedAnalyses] = useState([]);

  // Photo Upload Handler
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    if (analysisData.photos.length + files.length <= 5) {
      const newPhotos = files.map(file => ({
        id: Date.now() + Math.random(),
        file,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      setAnalysisData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    } else {
      alert('Maximum 5 photos allowed');
    }
  };

  const removePhoto = (photoId) => {
    setAnalysisData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  // Body Shape Calculator
  const calculateBodyShape = () => {
    const { bust, waist, hips, shoulders } = analysisData.bodyShape;
    const bustNum = parseFloat(bust);
    const waistNum = parseFloat(waist);
    const hipsNum = parseFloat(hips);
    const shouldersNum = parseFloat(shoulders);

    let bodyType = '';
    
    if (Math.abs(bustNum - hipsNum) <= 2 && waistNum < bustNum - 4) {
      bodyType = 'Hourglass';
    } else if (bustNum > hipsNum + 2 && shouldersNum > hipsNum + 2) {
      bodyType = 'Inverted Triangle';
    } else if (hipsNum > bustNum + 2 && hipsNum > shouldersNum + 2) {
      bodyType = 'Pear';
    } else if (Math.abs(bustNum - waistNum) <= 2 && Math.abs(waistNum - hipsNum) <= 2) {
      bodyType = 'Rectangle';
    } else if (waistNum > bustNum && waistNum > hipsNum) {
      bodyType = 'Apple';
    } else {
      bodyType = 'Oval';
    }

    setAnalysisData(prev => ({
      ...prev,
      bodyShape: { ...prev.bodyShape, bodyType }
    }));
  };

  // Get Body Shape Description
  const getBodyShapeDescription = (bodyType) => {
    const descriptions = {
      'Hourglass': 'Balanced proportions with a defined waist. Best styles emphasize your natural curves.',
      'Pear': 'Hips wider than shoulders and bust. Focus on balancing your silhouette by emphasizing your upper body.',
      'Apple': 'Fuller through the midsection with narrower hips. Create vertical lines and draw attention upward.',
      'Rectangle': 'Similar measurements throughout. Create curves and definition with strategic styling.',
      'Inverted Triangle': 'Broader shoulders and bust than hips. Balance your proportions by adding volume to your lower body.',
      'Oval': 'Fuller through the middle with narrower shoulders and hips. Create vertical lines and emphasize your best features.'
    };
    return descriptions[bodyType] || 'Each body shape is beautiful and has its own styling advantages.';
  };

  // Get Season Characteristics
  const getSeasonCharacteristics = (season) => {
    const seasonData = {
      'Light Spring': { dominant: 'Light', secondary: 'Warm' },
      'Warm Spring': { dominant: 'Warm', secondary: 'Light' },
      'Bright Spring': { dominant: 'Bright', secondary: 'Warm' },
      'Light Summer': { dominant: 'Light', secondary: 'Cool' },
      'Cool Summer': { dominant: 'Cool', secondary: 'Light' },
      'Soft Summer': { dominant: 'Muted', secondary: 'Cool' },
      'Soft Autumn': { dominant: 'Muted', secondary: 'Warm' },
      'Warm Autumn': { dominant: 'Warm', secondary: 'Muted' },
      'Deep Autumn': { dominant: 'Deep', secondary: 'Warm' },
      'Bright Winter': { dominant: 'Bright', secondary: 'Cool' },
      'Cool Winter': { dominant: 'Cool', secondary: 'Bright' },
      'Deep Winter': { dominant: 'Deep', secondary: 'Cool' }
    };
    return seasonData[season] || { dominant: '', secondary: '' };
  };

  // Get Color Season Description
  const getColorSeasonDescription = (season) => {
    const descriptions = {
      'Light Spring': 'Delicate, fresh colors with warm undertones. Think coral, turquoise, and cream.',
      'Warm Spring': 'Golden, vibrant colors with yellow undertones. Perfect for orange-reds and golden yellows.',
      'Bright Spring': 'Clear, vivid colors with warm undertones. Brilliant oranges and bright turquoise work beautifully.',
      'Light Summer': 'Soft, ethereal colors with cool undertones. Powder blue and dusty pink are ideal.',
      'Cool Summer': 'Elegant, refined colors with blue undertones. Navy and burgundy are perfect choices.',
      'Soft Summer': 'Muted, sophisticated colors with cool undertones. Sage green and dusty rose work well.',
      'Soft Autumn': 'Earthy, muted colors with warm undertones. Sage green and dusty coral are perfect.',
      'Warm Autumn': 'Rich, golden colors with warm undertones. Rust and forest green are ideal.',
      'Deep Autumn': 'Intense, warm colors with golden undertones. Deep rust and burgundy work beautifully.',
      'Bright Winter': 'Bold, striking colors with cool undertones. True red and royal blue are perfect.',
      'Cool Winter': 'Icy, elegant colors with blue undertones. Navy and burgundy work wonderfully.',
      'Deep Winter': 'Dramatic, intense colors with cool undertones. Pure white and deep red are ideal.'
    };
    return descriptions[season] || 'Each color season has its own unique beauty and perfect palette.';
  };

  // Color Season Analysis
  const analyzeColorSeason = () => {
    const { hairColor, eyeColor, skinTone, undertone } = analysisData.colorAnalysis;
    
    let season = '';
    let dominant = '';
    let secondary = '';

    // Simplified analysis logic
    if (undertone.includes('warm')) {
      if (skinTone.includes('light') || skinTone.includes('fair')) {
        season = hairColor.includes('light') ? 'Light Spring' : 'Warm Spring';
        dominant = hairColor.includes('light') ? 'Light' : 'Warm';
        secondary = hairColor.includes('light') ? 'Warm' : 'Light';
      } else {
        season = hairColor.includes('dark') ? 'Deep Autumn' : 'Warm Autumn';
        dominant = hairColor.includes('dark') ? 'Deep' : 'Warm';
        secondary = hairColor.includes('dark') ? 'Warm' : 'Muted';
      }
    } else if (undertone.includes('cool')) {
      if (skinTone.includes('light') || skinTone.includes('fair')) {
        season = eyeColor.includes('bright') ? 'Light Summer' : 'Cool Summer';
        dominant = eyeColor.includes('bright') ? 'Light' : 'Cool';
        secondary = eyeColor.includes('bright') ? 'Cool' : 'Muted';
      } else {
        season = hairColor.includes('black') || hairColor.includes('very dark') ? 'Deep Winter' : 'Cool Winter';
        dominant = hairColor.includes('black') ? 'Deep' : 'Cool';
        secondary = hairColor.includes('black') ? 'Cool' : 'Bright';
      }
    }

    setAnalysisData(prev => ({
      ...prev,
      colorAnalysis: {
        ...prev.colorAnalysis,
        season,
        dominantCharacteristic: dominant,
        secondaryCharacteristic: secondary
      }
    }));
  };

  // Generate Prompt A (for Dataset Z analysis)
  const generatePromptA = () => {
    const { personalInfo, bodyShape, colorAnalysis, values, photos } = analysisData;
    
    const prompt = `
PERSONAL STYLING ANALYSIS REQUEST

CLIENT PROFILE:
- Name: ${personalInfo.name || 'Anonymous Client'}
- Age: ${personalInfo.age || 'Not specified'}
- Gender: ${personalInfo.gender}
- Height: ${personalInfo.height || 'Not specified'}
- Weight: ${personalInfo.weight || 'Not specified'}

BODY ANALYSIS:
- Body Type: ${bodyShape.bodyType}
- Measurements: Bust: ${bodyShape.bust}, Waist: ${bodyShape.waist}, Hips: ${bodyShape.hips}, Shoulders: ${bodyShape.shoulders}
- Body Concerns: ${bodyShape.concerns.join(', ')}
- Style Goals: ${bodyShape.goals.join(', ')}

COLOR ANALYSIS:
- Season: ${colorAnalysis.season}
- Dominant Characteristic: ${colorAnalysis.dominantCharacteristic}
- Secondary Characteristic: ${colorAnalysis.secondaryCharacteristic}
- Hair Color: ${colorAnalysis.hairColor}
- Eye Color: ${colorAnalysis.eyeColor}
- Skin Tone: ${colorAnalysis.skinTone}
- Undertone: ${colorAnalysis.undertone}

VALUES & PREFERENCES:
- Sustainability Score: ${values.sustainability}/10
- Luxury Preference: ${values.luxury}/10
- Comfort Priority: ${values.comfort}/10
- Trend Consciousness: ${values.trendiness}/10
- Budget Range: ${values.budget}
- Lifestyle: ${values.lifestyle}
- Style Priorities: ${values.priorities.join(', ')}

REFERENCE PHOTOS: ${photos.length} photos uploaded for style reference

ANALYSIS REQUEST:
Using Dataset Z (comprehensive fashion database including color theory, body shape guidelines, sustainable fashion options, and style frameworks), please provide a detailed analysis of this client's:

1. Optimal color palette with specific hex codes and seasonal recommendations
2. Body-flattering silhouettes and style guidelines
3. Sustainable fashion options aligned with their values
4. Style personality assessment
5. Wardrobe essentials list
6. Shopping priorities

Please format the response as structured data that can be processed for further product recommendations.
    `;

    setPromptA(prompt);
    return prompt;
  };

  // Process with AI (Mock function - would integrate with Claude API)
  const processWithAI = async (prompt, dataset) => {
    setAiProcessing(true);
    
    // Mock AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    if (dataset === 'Z') {
      // Mock response from Dataset Z analysis
      const analysisResults = {
        colorPalette: {
          season: analysisData.colorAnalysis.season,
          primaryColors: ['#FF7F50', '#40E0D0', '#F5F5DC', '#FFB6C1'],
          neutrals: ['#F5F5DC', '#C19A6B', '#8B8680'],
          accents: ['#FF7F50', '#32CD32', '#FFFF8B']
        },
        bodyRecommendations: {
          bestSilhouettes: ['A-line', 'Wrap', 'Fit and flare'],
          avoidSilhouettes: ['Tight fitting', 'Straight cut'],
          focusAreas: ['Emphasize waist', 'Create vertical lines'],
          flattering: ['V-necks', 'Empire waist', 'Belted styles']
        },
        sustainabilityOptions: {
          brands: ['Everlane', 'Reformation', 'Patagonia'],
          materials: ['Organic cotton', 'Tencel', 'Recycled polyester'],
          care: ['Cold wash', 'Air dry', 'Steam instead of dry clean']
        },
        stylePersonality: 'Classic with Modern touches',
        wardrobeEssentials: [
          'White button-down shirt', 'Well-fitted jeans', 'Blazer in navy',
          'Little black dress', 'Comfortable flats', 'Statement necklace'
        ]
      };

      // Generate Prompt B for Shopify product recommendations
      const promptB = generatePromptB(analysisResults);
      setPromptB(promptB);

      // Process Prompt B with Shopify dataset
      const shopifyResults = await processWithShopifyAI(promptB);
      
      setFinalResults({
        analysis: analysisResults,
        recommendations: shopifyResults
      });
    }
    
    setAiProcessing(false);
    setAnalysisComplete(true);
  };

  // Generate Prompt B (for Shopify product recommendations)
  const generatePromptB = (analysisResults) => {
    return `
PRODUCT RECOMMENDATION REQUEST

Based on the comprehensive style analysis, please recommend specific products from the Shopify store (Dataset Y) for this client:

CLIENT REQUIREMENTS:
- Color Season: ${analysisResults.colorPalette.season}
- Primary Colors: ${analysisResults.colorPalette.primaryColors.join(', ')}
- Body Type: ${analysisData.bodyShape.bodyType}
- Best Silhouettes: ${analysisResults.bodyRecommendations.bestSilhouettes.join(', ')}
- Style Personality: ${analysisResults.stylePersonality}
- Budget: ${analysisData.values.budget}
- Sustainability Score: ${analysisData.values.sustainability}/10

WARDROBE ESSENTIALS NEEDED:
${analysisResults.wardrobeEssentials.join('\n- ')}

Please recommend:
1. 5-10 specific products with SKUs, prices, and availability
2. Complete outfit combinations (3-4 outfits)
3. Sustainable alternatives where available
4. Accessories that complement the color palette
5. Priority items based on client's goals and budget

Format response with product details, styling tips, and purchase recommendations.
    `;
  };

  // Process Prompt B with Shopify AI (Mock function)
  const processWithShopifyAI = async (promptB) => {
    // Mock Shopify product recommendations
    return {
      summary: `Perfect color palette identified for ${analysisData.colorAnalysis.season}. Body type ${analysisData.bodyShape.bodyType} with focus on ${analysisData.bodyShape.goals.join(' and ')}.`,
      products: [
        {
          id: 'prod_001',
          name: 'Coral Wrap Dress',
          price: 89.99,
          image: '/placeholder-dress.jpg',
          colors: ['Coral', 'Navy'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          sustainable: true,
          reason: 'Perfect for your color season and body type'
        },
        {
          id: 'prod_002',
          name: 'Navy Blazer',
          price: 149.99,
          image: '/placeholder-blazer.jpg',
          colors: ['Navy', 'Black'],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          sustainable: false,
          reason: 'Essential wardrobe piece for your style'
        }
      ],
      outfits: [
        {
          name: 'Professional Chic',
          items: ['Navy Blazer', 'White Blouse', 'Straight Leg Trousers'],
          occasion: 'Work',
          totalPrice: 299.97
        },
        {
          name: 'Weekend Casual',
          items: ['Coral Wrap Dress', 'Denim Jacket', 'White Sneakers'],
          occasion: 'Casual',
          totalPrice: 189.97
        }
      ]
    };
  };

  // Export Color Palette Function
  const exportColorPalette = () => {
    if (!finalResults) {
      alert('Please complete the analysis first');
      return;
    }

    const exportData = {
      client: analysisData.personalInfo.name || 'Style Analysis',
      date: new Date().toISOString(),
      bodyType: analysisData.bodyShape.bodyType,
      colorSeason: analysisData.colorAnalysis.season,
      analysis: finalResults.analysis,
      recommendations: finalResults.recommendations,
      prompts: {
        promptA: promptA,
        promptB: promptB
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analysisData.personalInfo.name || 'style'}_analysis_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Save Analysis (if logged in)
  const saveAnalysis = () => {
    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }

    const savedAnalysis = {
      id: Date.now(),
      date: new Date().toISOString(),
      clientName: analysisData.personalInfo.name,
      analysis: analysisData,
      results: finalResults,
      promptA,
      promptB
    };

    setSavedAnalyses(prev => [...prev, savedAnalysis]);
    alert('Analysis saved successfully!');
  };

  // Authentication Handler
  const handleAuth = (e) => {
    e.preventDefault();
    // Mock authentication
    setIsLoggedIn(true);
    setShowAuth(false);
    alert(`${authMode === 'login' ? 'Logged in' : 'Registered'} successfully!`);
  };

  const completeAnalysis = async () => {
    // Auto-calculate body shape and color season
    calculateBodyShape();
    analyzeColorSeason();
    
    // Generate and process prompts
    const promptA = generatePromptA();
    await processWithAI(promptA, 'Z');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header with Authentication */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Personal Style AI Platform
          </h1>
          <p className="text-gray-600">Complete style analysis with AI-powered recommendations</p>
        </div>
        
        <div className="flex gap-2">
          {!isLoggedIn ? (
            <>
              <Button variant="outline" onClick={() => { setAuthMode('login'); setShowAuth(true); }}>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button onClick={() => { setAuthMode('register'); setShowAuth(true); }}>
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome back!</span>
              <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{authMode === 'login' ? 'Login' : 'Register'}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAuth(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={userCredentials.name}
                      onChange={(e) => setUserCredentials({...userCredentials, name: e.target.value})}
                      required
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userCredentials.email}
                    onChange={(e) => setUserCredentials({...userCredentials, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={userCredentials.password}
                    onChange={(e) => setUserCredentials({...userCredentials, password: e.target.value})}
                    required
                  />
                </div>
                {authMode === 'register' && (
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={userCredentials.confirmPassword}
                      onChange={(e) => setUserCredentials({...userCredentials, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                )}
                <Button type="submit" className="w-full">
                  {authMode === 'login' ? 'Login' : 'Register'}
                </Button>
                <p className="text-center text-sm">
                  {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  >
                    {authMode === 'login' ? 'Register' : 'Login'}
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 5 && (
                <div className={`w-12 h-1 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Tabs value={`step${currentStep}`} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="step1" onClick={() => setCurrentStep(1)}>
            <User className="w-4 h-4 mr-2" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="step2" onClick={() => setCurrentStep(2)}>
            <Users className="w-4 h-4 mr-2" />
            Body Shape
          </TabsTrigger>
          <TabsTrigger value="step3" onClick={() => setCurrentStep(3)}>
            <Palette className="w-4 h-4 mr-2" />
            Color Analysis
          </TabsTrigger>
          <TabsTrigger value="step4" onClick={() => setCurrentStep(4)}>
            <Heart className="w-4 h-4 mr-2" />
            Values & Style
          </TabsTrigger>
          <TabsTrigger value="step5" onClick={() => setCurrentStep(5)}>
            <Camera className="w-4 h-4 mr-2" />
            Photos & Results
          </TabsTrigger>
        </TabsList>

        {/* Step 1: Personal Information */}
        <TabsContent value="step1">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name (Optional)</Label>
                  <Input
                    id="name"
                    value={analysisData.personalInfo.name}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, name: e.target.value }
                    }))}
                    placeholder="Enter your full name (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age (Optional)</Label>
                  <Input
                    id="age"
                    type="number"
                    value={analysisData.personalInfo.age}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, age: e.target.value }
                    }))}
                    placeholder="Your age (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    className="w-full px-3 py-2 border rounded-md"
                    value={analysisData.personalInfo.gender}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, gender: e.target.value }
                    }))}
                  >
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="height">Height in cm (Optional)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={analysisData.personalInfo.height}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, height: e.target.value }
                    }))}
                    placeholder="Height in cm (optional)"
                  />
                </div>
              </div>
              <Button 
                onClick={() => setCurrentStep(2)} 
                className="w-full"
                disabled={!analysisData.personalInfo.gender}
              >
                Next: Body Shape Analysis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Body Shape Calculator */}
        <TabsContent value="step2">
          <Card>
            <CardHeader>
              <CardTitle>Body Shape Analysis</CardTitle>
              <p className="text-sm text-gray-600">Choose your body shape or use our calculator to determine it</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Body Shape Selection Method */}
              <div className="space-y-4">
                <Label className="text-base font-medium">How would you like to determine your body shape?</Label>
                <div className="flex gap-4">
                  <Button
                    variant={analysisData.bodyShape.selectionMethod === 'manual' ? 'default' : 'outline'}
                    onClick={() => setAnalysisData(prev => ({
                      ...prev,
                      bodyShape: { ...prev.bodyShape, selectionMethod: 'manual', bodyType: '' }
                    }))}
                    className="flex-1"
                  >
                    I Know My Body Shape
                  </Button>
                  <Button
                    variant={analysisData.bodyShape.selectionMethod === 'calculator' ? 'default' : 'outline'}
                    onClick={() => setAnalysisData(prev => ({
                      ...prev,
                      bodyShape: { ...prev.bodyShape, selectionMethod: 'calculator', bodyType: '' }
                    }))}
                    className="flex-1"
                  >
                    Use Calculator
                  </Button>
                </div>
              </div>

              {/* Manual Body Shape Selection */}
              {analysisData.bodyShape.selectionMethod === 'manual' && (
                <div className="space-y-4">
                  <Label htmlFor="bodyTypeSelect">Select Your Body Shape</Label>
                  <select
                    id="bodyTypeSelect"
                    className="w-full px-3 py-2 border rounded-md"
                    value={analysisData.bodyShape.bodyType}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      bodyShape: { ...prev.bodyShape, bodyType: e.target.value }
                    }))}
                  >
                    <option value="">Choose your body shape</option>
                    <option value="Hourglass">Hourglass - Balanced bust and hips, defined waist</option>
                    <option value="Pear">Pear - Hips wider than bust and shoulders</option>
                    <option value="Apple">Apple - Fuller midsection, narrower hips</option>
                    <option value="Rectangle">Rectangle - Similar bust, waist, and hip measurements</option>
                    <option value="Inverted Triangle">Inverted Triangle - Broader shoulders/bust than hips</option>
                    <option value="Oval">Oval - Fuller through the middle with narrower shoulders and hips</option>
                  </select>
                  
                  {analysisData.bodyShape.bodyType && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                          Selected Body Type: {analysisData.bodyShape.bodyType}
                        </h3>
                        <p className="text-green-700 text-sm">
                          {getBodyShapeDescription(analysisData.bodyShape.bodyType)}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Calculator Method */}
              {analysisData.bodyShape.selectionMethod === 'calculator' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="bust">Bust/Chest (cm)</Label>
                      <Input
                        id="bust"
                        type="number"
                        value={analysisData.bodyShape.bust}
                        onChange={(e) => setAnalysisData(prev => ({
                          ...prev,
                          bodyShape: { ...prev.bodyShape, bust: e.target.value }
                        }))}
                        placeholder="Bust measurement"
                      />
                    </div>
                    <div>
                      <Label htmlFor="waist">Waist (cm)</Label>
                      <Input
                        id="waist"
                        type="number"
                        value={analysisData.bodyShape.waist}
                        onChange={(e) => setAnalysisData(prev => ({
                          ...prev,
                          bodyShape: { ...prev.bodyShape, waist: e.target.value }
                        }))}
                        placeholder="Waist measurement"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hips">Hips (cm)</Label>
                      <Input
                        id="hips"
                        type="number"
                        value={analysisData.bodyShape.hips}
                        onChange={(e) => setAnalysisData(prev => ({
                          ...prev,
                          bodyShape: { ...prev.bodyShape, hips: e.target.value }
                        }))}
                        placeholder="Hip measurement"
                      />
                    </div>
                    <div>
                      <Label htmlFor="shoulders">Shoulders (cm)</Label>
                      <Input
                        id="shoulders"
                        type="number"
                        value={analysisData.bodyShape.shoulders}
                        onChange={(e) => setAnalysisData(prev => ({
                          ...prev,
                          bodyShape: { ...prev.bodyShape, shoulders: e.target.value }
                        }))}
                        placeholder="Shoulder measurement"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={calculateBodyShape} 
                    variant="outline" 
                    className="w-full"
                    disabled={!analysisData.bodyShape.bust || !analysisData.bodyShape.waist || !analysisData.bodyShape.hips || !analysisData.bodyShape.shoulders}
                  >
                    Calculate Body Shape
                  </Button>

                  {analysisData.bodyShape.bodyType && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                          Calculated Body Type: {analysisData.bodyShape.bodyType}
                        </h3>
                        <p className="text-green-700 text-sm">
                          Based on your measurements: Bust {analysisData.bodyShape.bust}cm, 
                          Waist {analysisData.bodyShape.waist}cm, Hips {analysisData.bodyShape.hips}cm, 
                          Shoulders {analysisData.bodyShape.shoulders}cm
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Common Fields for Both Methods */}
              {analysisData.bodyShape.bodyType && (
                <div className="space-y-4">
                  <div>
                    <Label>Body Concerns (select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Waist definition', 'Hip balance', 'Shoulder width', 'Height', 'Proportions'].map(concern => (
                        <label key={concern} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={analysisData.bodyShape.concerns.includes(concern)}
                            onChange={(e) => {
                              const concerns = e.target.checked
                                ? [...analysisData.bodyShape.concerns, concern]
                                : analysisData.bodyShape.concerns.filter(c => c !== concern);
                              setAnalysisData(prev => ({
                                ...prev,
                                bodyShape: { ...prev.bodyShape, concerns }
                              }));
                            }}
                          />
                          <span className="text-sm">{concern}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Style Goals</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Look taller', 'Emphasize curves', 'Create balance', 'Look slimmer', 'Professional appearance'].map(goal => (
                        <label key={goal} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={analysisData.bodyShape.goals.includes(goal)}
                            onChange={(e) => {
                              const goals = e.target.checked
                                ? [...analysisData.bodyShape.goals, goal]
                                : analysisData.bodyShape.goals.filter(g => g !== goal);
                              setAnalysisData(prev => ({
                                ...prev,
                                bodyShape: { ...prev.bodyShape, goals }
                              }));
                            }}
                          />
                          <span className="text-sm">{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={() => setCurrentStep(3)} 
                className="w-full"
                disabled={!analysisData.bodyShape.bodyType}
              >
                Next: Color Analysis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Color Analysis */}
        <TabsContent value="step3">
          <Card>
            <CardHeader>
              <CardTitle>Color Season Analysis</CardTitle>
              <p className="text-sm text-gray-600">Choose your color season or use our analysis to determine it</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Color Analysis Selection Method */}
              <div className="space-y-4">
                <Label className="text-base font-medium">How would you like to determine your color season?</Label>
                <div className="flex gap-4">
                  <Button
                    variant={analysisData.colorAnalysis.selectionMethod === 'manual' ? 'default' : 'outline'}
                    onClick={() => setAnalysisData(prev => ({
                      ...prev,
                      colorAnalysis: { ...prev.colorAnalysis, selectionMethod: 'manual', season: '' }
                    }))}
                    className="flex-1"
                  >
                    I Know My Color Season
                  </Button>
                  <Button
                    variant={analysisData.colorAnalysis.selectionMethod === 'analysis' ? 'default' : 'outline'}
                    onClick={() => setAnalysisData(prev => ({
                      ...prev,
                      colorAnalysis: { ...prev.colorAnalysis, selectionMethod: 'analysis', season: '' }
                    }))}
                    className="flex-1"
                  >
                    Use Color Analysis
                  </Button>
                </div>
              </div>

              {/* Manual Color Season Selection */}
              {analysisData.colorAnalysis.selectionMethod === 'manual' && (
                <div className="space-y-4">
                  <Label htmlFor="seasonSelect">Select Your Color Season</Label>
                  <select
                    id="seasonSelect"
                    className="w-full px-3 py-2 border rounded-md"
                    value={analysisData.colorAnalysis.season}
                    onChange={(e) => {
                      const selectedSeason = e.target.value;
                      const seasonData = getSeasonCharacteristics(selectedSeason);
                      setAnalysisData(prev => ({
                        ...prev,
                        colorAnalysis: { 
                          ...prev.colorAnalysis, 
                          season: selectedSeason,
                          dominantCharacteristic: seasonData.dominant,
                          secondaryCharacteristic: seasonData.secondary
                        }
                      }));
                    }}
                  >
                    <option value="">Choose your color season</option>
                    <optgroup label="Spring Family (Warm)">
                      <option value="Light Spring">Light Spring - Light, warm, delicate colors</option>
                      <option value="Warm Spring">Warm Spring - Golden, vibrant, energetic colors</option>
                      <option value="Bright Spring">Bright Spring - Clear, warm, vivid colors</option>
                    </optgroup>
                    <optgroup label="Summer Family (Cool)">
                      <option value="Light Summer">Light Summer - Soft, cool, ethereal colors</option>
                      <option value="Cool Summer">Cool Summer - Cool, elegant, refined colors</option>
                      <option value="Soft Summer">Soft Summer - Muted, cool, sophisticated colors</option>
                    </optgroup>
                    <optgroup label="Autumn Family (Warm)">
                      <option value="Soft Autumn">Soft Autumn - Muted, warm, earthy colors</option>
                      <option value="Warm Autumn">Warm Autumn - Rich, warm, golden colors</option>
                      <option value="Deep Autumn">Deep Autumn - Deep, warm, intense colors</option>
                    </optgroup>
                    <optgroup label="Winter Family (Cool)">
                      <option value="Bright Winter">Bright Winter - Bold, cool, striking colors</option>
                      <option value="Cool Winter">Cool Winter - Icy, cool, elegant colors</option>
                      <option value="Deep Winter">Deep Winter - Deep, cool, dramatic colors</option>
                    </optgroup>
                  </select>
                  
                  {analysisData.colorAnalysis.season && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="pt-4">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          Selected Color Season: {analysisData.colorAnalysis.season}
                        </h3>
                        <p className="text-blue-700 text-sm">
                          {getColorSeasonDescription(analysisData.colorAnalysis.season)}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Analysis Method */}
              {analysisData.colorAnalysis.selectionMethod === 'analysis' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hairColor">Natural Hair Color</Label>
                      <select
                        id="hairColor"
                        className="w-full px-3 py-2 border rounded-md"
                        value={analysisData.colorAnalysis.hairColor}
                        onChange={(e) => setAnalysisData(prev => ({
                          ...prev,
                          colorAnalysis: { ...prev.colorAnalysis, hairColor: e.target.value }
                        }))}
                      >
                        <option value="">Select hair color</option>
                        <optgroup label="Blonde">
                          <option value="platinum blonde">Platinum Blonde</option>
                          <option value="light blonde">Light Blonde</option>
                          <option value="golden blonde">Golden Blonde</option>
                          <option value="ash blonde">Ash Blonde</option>
                          <option value="strawberry blonde">Strawberry Blonde</option>
                          <option value="dirty blonde">Dirty Blonde</option>
                        </optgroup>
                        <optgroup label="Brown">
                          <option value="light brown">Light Brown</option>
                          <option value="golden brown">Golden Brown</option>
                          <option value="ash brown">Ash Brown</option>
                          <option value="medium brown">Medium Brown</option>
                          <option value="dark brown">Dark Brown</option>
                          <option value="chestnut brown">Chestnut Brown</option>
                        </optgroup>
                        <optgroup label="Red">
                          <option value="light auburn">Light Auburn</option>
                          <option value="auburn">Auburn</option>
                          <option value="dark auburn">Dark Auburn</option>
                          <option value="copper red">Copper Red</option>
                          <option value="bright red">Bright Red</option>
                        </optgroup>
                        <optgroup label="Black & Grey">
                          <option value="black">Black</option>
                          <option value="salt and pepper">Salt and Pepper</option>
                          <option value="grey">Grey</option>
                          <option value="white">White</option>
                        </optgroup>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="eyeColor">Eye Color</Label>
                      <select
                        id="eyeColor"
                        className="w-full px-3 py-2 border rounded-md"
                        value={analysisData.colorAnalysis.eyeColor}
                        onChange={(e) => setAnalysisData(prev => ({
                          ...prev,
                          colorAnalysis: { ...prev.colorAnalysis, eyeColor: e.target.value }
                        }))}
                      >
                        <option value="">Select eye color</option>
                        <optgroup label="Blue">
                          <option value="light blue">Light Blue</option>
                          <option value="bright blue">Bright Blue</option>
                          <option value="deep blue">Deep Blue</option>
                          <option value="blue-grey">Blue-Grey</option>
                          <option value="steel blue">Steel Blue</option>
                        </optgroup>
                        <optgroup label="Green">
                          <option value="light green">Light Green</option>
                          <option value="bright green">Bright Green</option>
                          <option value="emerald green">Emerald Green</option>
                          <option value="hazel green">Hazel Green</option>
                          <option value="olive green">Olive Green</option>
                        </optgroup>
                        <optgroup label="Brown">
                          <option value="light brown">Light Brown</option>
                          <option value="golden brown">Golden Brown</option>
                          <option value="brown with gold flecks">Brown with Gold Flecks</option>
                          <option value="dark brown">Dark Brown</option>
                          <option value="amber">Amber</option>
                        </optgroup>
                        <optgroup label="Hazel & Mixed">
                          <option value="hazel">Hazel</option>
                          <option value="green-brown">Green-Brown</option>
                          <option value="blue-green">Blue-Green</option>
                        </optgroup>
                        <optgroup label="Grey & Other">
                          <option value="grey">Grey</option>
                          <option value="black">Black</option>
                          <option value="violet">Violet</option>
                        </optgroup>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="skinTone">Skin Tone</Label>
                      <select
                        id="skinTone"
                        className="w-full px-3 py-2 border rounded-md"
                        value={analysisData.colorAnalysis.skinTone}
                        onChange={(e) => setAnalysisData(prev => ({
                          ...prev,
                          colorAnalysis: { ...prev.colorAnalysis, skinTone: e.target.value }
                        }))}
                      >
                        <option value="">Select skin tone</option>
                        <option value="very fair">Very Fair</option>
                        <option value="fair">Fair</option>
                        <option value="light">Light</option>
                        <option value="medium">Medium</option>
                        <option value="olive">Olive</option>
                        <option value="tan">Tan</option>
                        <option value="deep">Deep</option>
                        <option value="dark">Dark</option>
                        <option value="very dark">Very Dark</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="undertone">Undertone</Label>
                      <select
                        id="undertone"
                        className="w-full px-3 py-2 border rounded-md"
                        value={analysisData.colorAnalysis.undertone}
                        onChange={(e) => setAnalysisData(prev => ({
                          ...prev,
                          colorAnalysis: { ...prev.colorAnalysis, undertone: e.target.value }
                        }))}
                      >
                        <option value="">Select undertone</option>
                        <option value="warm">Warm (Yellow/Golden)</option>
                        <option value="cool">Cool (Pink/Blue)</option>
                        <option value="neutral">Neutral</option>
                        <option value="olive">Olive</option>
                      </select>
                    </div>
                  </div>

                  <Button 
                    onClick={analyzeColorSeason} 
                    variant="outline" 
                    className="w-full"
                    disabled={!analysisData.colorAnalysis.hairColor || !analysisData.colorAnalysis.eyeColor || !analysisData.colorAnalysis.skinTone || !analysisData.colorAnalysis.undertone}
                  >
                    Analyze Color Season
                  </Button>

                  {analysisData.colorAnalysis.season && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="pt-4">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">
                          Analyzed Color Season: {analysisData.colorAnalysis.season}
                        </h3>
                        <p className="text-blue-700 text-sm mb-2">
                          Dominant: {analysisData.colorAnalysis.dominantCharacteristic} | 
                          Secondary: {analysisData.colorAnalysis.secondaryCharacteristic}
                        </p>
                        <p className="text-blue-700 text-sm">
                          Based on: {analysisData.colorAnalysis.hairColor} hair, {analysisData.colorAnalysis.eyeColor} eyes, 
                          {analysisData.colorAnalysis.skinTone} skin with {analysisData.colorAnalysis.undertone} undertones
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              <Button 
                onClick={() => setCurrentStep(4)} 
                className="w-full"
                disabled={!analysisData.colorAnalysis.season}
              >
                Next: Values & Style Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 4: Values & Style Preferences */}
        <TabsContent value="step4">
          <Card>
            <CardHeader>
              <CardTitle>Style Values & Preferences</CardTitle>
              <p className="text-sm text-gray-600">Help us understand your fashion values and lifestyle</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Value Sliders */}
              <div className="space-y-4">
                <div>
                  <Label>Sustainability Importance (0-10)</Label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={analysisData.values.sustainability}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      values: { ...prev.values, sustainability: parseInt(e.target.value) }
                    }))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Not Important</span>
                    <span className="font-medium">{analysisData.values.sustainability}</span>
                    <span>Very Important</span>
                  </div>
                </div>

                <div>
                  <Label>Luxury Preference (0-10)</Label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={analysisData.values.luxury}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      values: { ...prev.values, luxury: parseInt(e.target.value) }
                    }))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Budget-Friendly</span>
                    <span className="font-medium">{analysisData.values.luxury}</span>
                    <span>Luxury Focused</span>
                  </div>
                </div>

                <div>
                  <Label>Comfort Priority (0-10)</Label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={analysisData.values.comfort}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      values: { ...prev.values, comfort: parseInt(e.target.value) }
                    }))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Style Over Comfort</span>
                    <span className="font-medium">{analysisData.values.comfort}</span>
                    <span>Comfort First</span>
                  </div>
                </div>

                <div>
                  <Label>Trend Consciousness (0-10)</Label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={analysisData.values.trendiness}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      values: { ...prev.values, trendiness: parseInt(e.target.value) }
                    }))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Classic Styles</span>
                    <span className="font-medium">{analysisData.values.trendiness}</span>
                    <span>Latest Trends</span>
                  </div>
                </div>
              </div>

              {/* Budget and Lifestyle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <select
                    id="budget"
                    className="w-full px-3 py-2 border rounded-md"
                    value={analysisData.values.budget}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      values: { ...prev.values, budget: e.target.value }
                    }))}
                  >
                    <option value="">Select budget range</option>
                    <option value="under-100">Under $100</option>
                    <option value="100-300">$100 - $300</option>
                    <option value="300-500">$300 - $500</option>
                    <option value="500-1000">$500 - $1000</option>
                    <option value="over-1000">Over $1000</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="lifestyle">Lifestyle</Label>
                  <select
                    id="lifestyle"
                    className="w-full px-3 py-2 border rounded-md"
                    value={analysisData.values.lifestyle}
                    onChange={(e) => setAnalysisData(prev => ({
                      ...prev,
                      values: { ...prev.values, lifestyle: e.target.value }
                    }))}
                  >
                    <option value="">Select lifestyle</option>
                    <option value="professional">Professional/Corporate</option>
                    <option value="creative">Creative/Artistic</option>
                    <option value="casual">Casual/Relaxed</option>
                    <option value="social">Social/Event-focused</option>
                    <option value="active">Active/Athletic</option>
                    <option value="mixed">Mixed/Varied</option>
                  </select>
                </div>
              </div>

              {/* Style Priorities */}
              <div>
                <Label>Style Priorities (select top 3)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {[
                    'Quality over quantity', 'Versatile pieces', 'Statement items',
                    'Classic styles', 'Trendy pieces', 'Sustainable fashion',
                    'Local brands', 'Professional wardrobe', 'Casual comfort'
                  ].map(priority => (
                    <label key={priority} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={analysisData.values.priorities.includes(priority)}
                        onChange={(e) => {
                          const priorities = e.target.checked
                            ? [...analysisData.values.priorities, priority]
                            : analysisData.values.priorities.filter(p => p !== priority);
                          if (priorities.length <= 3) {
                            setAnalysisData(prev => ({
                              ...prev,
                              values: { ...prev.values, priorities }
                            }));
                          }
                        }}
                        disabled={!analysisData.values.priorities.includes(priority) && analysisData.values.priorities.length >= 3}
                      />
                      <span className="text-sm">{priority}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {analysisData.values.priorities.length}/3
                </p>
              </div>

              <Button 
                onClick={() => setCurrentStep(5)} 
                className="w-full"
                disabled={!analysisData.values.budget || !analysisData.values.lifestyle}
              >
                Next: Upload Photos & Get Results
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 5: Photos & Results */}
        <TabsContent value="step5">
          <div className="space-y-6">
            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Reference Photos (Optional)</CardTitle>
                <p className="text-sm text-gray-600">Upload up to 5 photos for style reference</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload photos</p>
                      <p className="text-xs text-gray-500">Max 5 photos, JPG/PNG</p>
                    </label>
                  </div>

                  {analysisData.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {analysisData.photos.map((photo) => (
                        <div key={photo.id} className="relative">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                            onClick={() => removePhoto(photo.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {!analysisComplete ? (
              <Card>
                <CardHeader>
                  <CardTitle>Ready for Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">
                      All information collected! Click below to generate your personalized style analysis.
                    </p>
                    <Button 
                      onClick={completeAnalysis} 
                      className="w-full"
                      disabled={aiProcessing}
                    >
                      {aiProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Style Analysis
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Final Results */
              <div className="space-y-6">
                {/* Analysis Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Your Style Analysis Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <h3 className="font-semibold">Body Type</h3>
                        <p className="text-lg text-blue-600">{analysisData.bodyShape.bodyType}</p>
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold">Color Season</h3>
                        <p className="text-lg text-purple-600">{analysisData.colorAnalysis.season}</p>
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold">Style Profile</h3>
                        <p className="text-lg text-green-600">{finalResults?.analysis.stylePersonality}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Color Palette */}
                {finalResults?.analysis.colorPalette && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Perfect Color Palette</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Primary Colors</h4>
                          <div className="flex gap-2">
                            {finalResults.analysis.colorPalette.primaryColors.map((color, idx) => (
                              <div key={idx} className="text-center">
                                <div 
                                  className="w-12 h-12 rounded-lg border"
                                  style={{ backgroundColor: color }}
                                />
                                <p className="text-xs mt-1">{color}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Neutrals</h4>
                          <div className="flex gap-2">
                            {finalResults.analysis.colorPalette.neutrals.map((color, idx) => (
                              <div key={idx} className="text-center">
                                <div 
                                  className="w-12 h-12 rounded-lg border"
                                  style={{ backgroundColor: color }}
                                />
                                <p className="text-xs mt-1">{color}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Product Recommendations */}
                {finalResults?.recommendations && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-600">{finalResults.recommendations.summary}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {finalResults.recommendations.products.map((product) => (
                            <div key={product.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{product.name}</h4>
                                <Badge variant={product.sustainable ? "default" : "secondary"}>
                                  {product.sustainable ? "Sustainable" : "Standard"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{product.reason}</p>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">${product.price}</span>
                                <Button size="sm">
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Outfit Suggestions */}
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">Complete Outfit Ideas</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {finalResults.recommendations.outfits.map((outfit, idx) => (
                              <Card key={idx}>
                                <CardContent className="pt-4">
                                  <h5 className="font-medium">{outfit.name}</h5>
                                  <p className="text-sm text-gray-600 mb-2">For: {outfit.occasion}</p>
                                  <ul className="text-sm list-disc list-inside mb-2">
                                    {outfit.items.map((item, itemIdx) => (
                                      <li key={itemIdx}>{item}</li>
                                    ))}
                                  </ul>
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold">${outfit.totalPrice}</span>
                                    <Button size="sm" variant="outline">Shop Outfit</Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button onClick={saveAnalysis} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {isLoggedIn ? 'Save Analysis' : 'Login to Save'}
                  </Button>
                  <Button variant="outline" onClick={exportColorPalette} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Processing Indicator */}
      {aiProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Analysis in Progress</h3>
              <p className="text-gray-600 mb-4">
                Processing your data with our advanced styling algorithms...
              </p>
              <div className="text-sm text-gray-500">
                <p>✓ Analyzing body shape and proportions</p>
                <p>✓ Processing color season data</p>
                <p>✓ Evaluating style preferences</p>
                <p>✓ Generating product recommendations</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Debug Prompts (for development) */}
      {promptA && (
        <Card className="mt-8 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Prompt A (Dataset Z)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={promptA} readOnly className="h-32 text-xs" />
          </CardContent>
        </Card>
      )}

      {promptB && (
        <Card className="mt-4 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-sm">Prompt B (Shopify Dataset Y)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={promptB} readOnly className="h-32 text-xs" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalStylingPlatform;
