from splinter import Browser
from bs4 import BeautifulSoup as bs
import pandas as pd
import pymongo

def init_browser():
    executable_path = {'executable_path': 'chromedriver.exe'}
    return Browser('chrome', **executable_path, headless=False)

def visit_site(html):
    # browser = init_browser()
    # browser.visit(url)
    # html = browser.html
    soup = bs(html, "html.parser")
    return soup


def scrape():
    mars_data = {}
    browser = init_browser()
    url = "https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest"
    browser.visit(url)
    html = browser.html
    #Scrape first news title
    soup = visit_site(html)
    news_title = soup.find("div", class_="content_title")
    first_news_title = news_title.text

    #Scrape news p
    news_p = soup.find("div", class_="article_teaser_body")
    first_news_p = news_p.text
    # print(f"Title: {first_news_title}")
    # print(f"P: {first_news_p}")
    mars_data["top_title"] = first_news_title
    mars_data["top_paragraph"] = first_news_p

    #browser.quit()
    url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(url)
    html = browser.html

    #Scrape featured image
    soup = visit_site(html)
    image = soup.find("a", class_="fancybox")
    
    #Visit page with largesize of featured image
    featured_image_url = f"https://www.jpl.nasa.gov{image['data-link']}"
    browser.visit(featured_image_url)
    html = browser.html
    soup = visit_site(html)
    
    #Get largesize of featured image
    feature_image = soup.find("img", class_="main_image")
    image = feature_image['src']
    featured_image_url = f"https://www.jpl.nasa.gov{image}"
    #print(featured_image_url)
    mars_data["Featured_image"] = featured_image_url
    #browser.quit()

    url = "https://twitter.com/marswxreport?lang=en"
    browser.visit(url)
    html = browser.html
    #Scrape weather from tweet
    soup = visit_site(html)
    tweet = soup.find_all("p", class_="tweet-text")
    mars_weather = tweet[0].text
    #print(mars_weather)
    #Remove twitter pic
    new_mars_weather = mars_weather.split("pic")
    #print(new_mars_weather[0])
    mars_data["Weather"] = new_mars_weather[0]
    #browser.quit()

    
    url = "https://space-facts.com/mars/"
    browser.visit(url)
    html = browser.html
    #Scrape Mars facts
    soup = visit_site(html)
    facts = soup.find("table", class_="tablepress-id-mars")
    
    #convert tag to str so it can be read
    facts_table = pd.read_html(str(facts))
    
    #Get df from list and rename columns
    facts_df = facts_table[0]
    facts_df_rename = facts_df.rename(columns={0:'Description',1:'Value'})

    #set new index
    final_facts_table= facts_df_rename.set_index("Description")
    #final_facts_table

    #Convert pandas df to html table
    facts_html_table = final_facts_table.to_html()
    
    #Remove \n from table
    clean_facts_html_table= facts_html_table.replace('\n', '')
    #print(clean_facts_html_table)
    mars_data["mars_facts_table"] = clean_facts_html_table

    #browser.quit()

    
    url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(url)
    #html = browser.html
    #Scrape hemispheres
    #soup = visit_site(html)
    hemisphere_image_urls =[]
    #names = ["Cerberus","Schiaparelli","Syrtis","Valles"]
    names = ["Cerberus Hemisphere","Schiaparelli Hemisphere","Syrtis Major Hemisphere","Valles Marineris Hemisphere"]
    for name in names:
        browser.click_link_by_partial_text(name)
        hemisphere_html = browser.html
        hemisphere_soup = visit_site(hemisphere_html)
        hemisphere_image = hemisphere_soup.find("img", class_="wide-image")
        #hemisphere_image['src']
        #hemispheres.append(f"https://astrogeology.usgs.gov{hemisphere_image['src']}")
        hemisphere = f"https://astrogeology.usgs.gov{hemisphere_image['src']}"
        hemisphere_image_urls.append({"title":name,"img_url":hemisphere})
        browser.visit(url)
    
    browser.quit()
    # for image in hemisphere_image_urls:
    #     print(image['img_url'])
    mars_data["Hemisphere_image"] = hemisphere_image_urls

    #print(mars_data)
    return mars_data

if __name__ == "__main__":
    scrape()