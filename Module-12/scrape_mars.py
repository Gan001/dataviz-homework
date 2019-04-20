from splinter import Browser
from bs4 import BeautifulSoup as bs
import pandas as pd
import pymongo

def init_browser():
    executable_path = {'executable_path': 'chromedriver.exe'}
    return Browser('chrome', **executable_path, headless=False)

def visit_site(url):
    browser = init_browser()
    browser.visit(url)
    html = browser.html
    soup = bs(html, "html.parser")
    return soup


def scrape():
    #Scrape first news title
    soup = visit_site('https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest')
    news_title = soup.find_all("div", class_="content_title")
    first_news_title = news_title[0].text

    #Scrape news p
    news_p = soup.find_all("div", class_="article_teaser_body")
    first_news_p = news_p[0].text
    print(f"Title: {first_news_title}")
    print(f"P: {first_news_p}")

    #Scrape featured image
    soup = visit_site('https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars')
    image = soup.find("a", class_="fancybox")
    
    featured_image_url = f"https://www.jpl.nasa.gov{image['data-link']}"
    soup = visit_site(featured_image_url)
    #Visit page with largesize of featured image
    # browser.visit(featured_image_url)
    # feature_html = browser.html
    # feature_soup = bs(feature_html, "html.parser")
    #Get largesize of featured image
    feature_image = soup.find("img", class_="main_image")
    image = feature_image['src']
    featured_image_url = f"https://www.jpl.nasa.gov{image}"
    print(featured_image_url)


if __name__ == "__main__":
    scrape()