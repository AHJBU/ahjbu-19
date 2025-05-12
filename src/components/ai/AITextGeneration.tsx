import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Clipboard, Code, Wand2, Copy, Check } from 'lucide-react';

interface AITextGenerationProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  seedText: string;
}

export const AITextGeneration: React.FC<AITextGenerationProps> = ({ title, description, icon, prompt, seedText }) => {
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(200);
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateText = async () => {
    if (!apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please set your OpenAI API key in the settings.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedText('');

    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: `${prompt}\n${seedText}`,
          max_tokens: maxTokens,
          temperature: temperature,
          stream: isStreaming,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      if (isStreaming) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let chunkText = '';

        while (true) {
          const { done, value } = await reader!.read();
          if (done) {
            break;
          }

          chunkText += decoder.decode(value);
          try {
            const parsedChunk = JSON.parse(chunkText);
            if (parsedChunk.choices && parsedChunk.choices[0].text) {
              setGeneratedText((prevText) => prevText + parsedChunk.choices[0].text);
            }
            chunkText = ''; // Reset chunk after successful parse
          } catch (error) {
            // Collect incomplete JSON chunks
          }
        }
      } else {
        const data = await response.json();
        setGeneratedText(data.choices[0].text);
      }
    } catch (error: any) {
      toast({
        title: 'Error generating text',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    toast({
      title: 'Copied to clipboard!',
      description: 'The generated text has been copied to your clipboard.',
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <Clipboard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground text-sm">
          {description}
        </CardDescription>
        <Tabs defaultValue="settings" className="mt-4">
          <TabsList>
            <TabsTrigger value="settings" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              <Wand2 className="h-4 w-4 mr-2" /> Settings
            </TabsTrigger>
            <TabsTrigger value="prompt" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              <Code className="h-4 w-4 mr-2" /> Prompt
            </TabsTrigger>
          </TabsList>
          <TabsContent value="settings" className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  min="0"
                  max="1"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  min="50"
                  max="500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="stream"
                  checked={isStreaming}
                  onCheckedChange={(checked) => setIsStreaming(checked)}
                />
                <Label htmlFor="stream">Stream</Label>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="prompt">
            <Textarea
              placeholder="Enter your prompt here."
              value={prompt}
              className="min-h-[100px]"
              readOnly
            />
          </TabsContent>
        </Tabs>
        <Textarea
          placeholder="Generated text will appear here."
          value={generatedText}
          className="mt-4 min-h-[150px]"
          readOnly
        />
      </CardContent>
      <CardFooter className="justify-between">
        <Button onClick={generateText} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
        <Button variant="secondary" onClick={handleCopyClick} disabled={copied || !generatedText}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </CardFooter>
    </Card>
  );
};
